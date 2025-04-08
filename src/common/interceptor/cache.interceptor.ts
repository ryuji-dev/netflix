import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Request,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    // GET /movie
    const key = `${req.method}-${req.url}`;
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return next.handle().pipe(tap((res) => this.cache.set(key, res)));
  }
}
