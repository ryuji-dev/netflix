import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { envVariableKeys } from 'src/common/const/env.const';

export interface JwtPayload {
  sub: string;
  role: string;
  type: 'refresh' | 'access';
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');
    if (basicSplit.length !== 2)
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    const [basic, token] = basicSplit;
    if (basic.toLowerCase() !== 'basic')
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const tokenSplit = decoded.split(':');
    if (tokenSplit.length !== 2)
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');
    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(' ');
    if (basicSplit.length !== 2)
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    const [bearer, token] = basicSplit;
    if (bearer.toLowerCase() !== 'bearer')
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>(
          isRefreshToken
            ? envVariableKeys.refreshTokenSecret
            : envVariableKeys.accessTokenSecret,
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== 'refresh')
          throw new BadRequestException('Refresh 토큰을 입력해 주세요.');
      } else {
        if (payload.type !== 'access')
          throw new BadRequestException('Access 토큰을 입력해 주세요.');
      }

      return payload;
    } catch {
      throw new BadRequestException('토큰이 만료되었습니다.');
    }
  }

  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('이미 가입된 이메일입니다.');

    const hash = await bcrypt.hash(
      password,
      this.configService.get<number>(envVariableKeys.hashRounds)!,
    );
    await this.userRepository.save({
      email,
      password: hash,
    });

    return this.userRepository.findOne({ where: { email } });
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || typeof user.password !== 'string')
      throw new BadRequestException('잘못된 이메일 또는 비밀번호입니다.');

    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk)
      throw new BadRequestException('잘못된 이메일 또는 비밀번호입니다.');

    return user;
  }

  async issueToken(user: { id: number; role: Role }, isRefreshToken: boolean) {
    const refreshTokenSecret = this.configService.get<string>(
      envVariableKeys.refreshTokenSecret,
    );
    const accessTokenSecret = this.configService.get<string>(
      envVariableKeys.accessTokenSecret,
    );

    return this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshToken ? '1d' : '300s',
      },
    );
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);
    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }
}
