import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 요청에서 user 객체가 존재하는지 확인
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { type: string } }>();
    if (!request.user || request.user.type !== 'access') return false;

    return true;
  }
}
