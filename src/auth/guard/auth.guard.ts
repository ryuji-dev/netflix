import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // public decoration이 되어있으면 모든 로직을 bypass
    const isPublic = this.reflector.get(Public, context.getHandler());
    if (isPublic) return true;

    // 요청에서 user 객체가 존재하는지 확인
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { type: string } }>();
    if (!request.user || request.user.type !== 'access') return false;

    return true;
  }
}
