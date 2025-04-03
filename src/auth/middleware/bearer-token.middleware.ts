import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { envVariableKeys } from 'src/common/const/env.const';
import { JwtPayload } from '../auth.service';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      next();
      return;
    }

    const token = this.validateBearerToken(authHeader);

    try {
      const decodedPayload = this.jwtService.decode<JwtPayload>(token);
      if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access')
        throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

      const secretKey = this.configService.get<string>(
        decodedPayload.type === 'refresh'
          ? envVariableKeys.refreshTokenSecret
          : envVariableKeys.accessTokenSecret,
      );
      if (!secretKey)
        throw new BadRequestException('토큰 시크릿 키가 설정되지 않았습니다.');

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: secretKey,
      });

      req.user = payload;
      next();
    } catch {
      throw new BadRequestException('토큰이 만료되었습니다.');
    }
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');
    if (basicSplit.length !== 2)
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    const [bearer, token] = basicSplit;
    if (bearer.toLowerCase() !== 'bearer')
      throw new BadRequestException('토큰 형식이 올바르지 않습니다.');

    return token;
  }
}
