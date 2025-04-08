import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Request,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const reqTime = Date.now();

    return next.handle().pipe(
      //   delay(1000),
      tap(() => {
        const resTime = Date.now();
        const diff = resTime - reqTime;

        // if (diff > 1000) {
        //   console.log(`TIMEOUT: [${req.method} ${req.url}] ${diff}ms`);
        //   throw new InternalServerErrorException(
        //     '서버 처리 시간이 너무 오래 걸렸습니다.',
        //   );
        // } else console.log(`[${req.method} ${req.url}] ${diff}ms`);
        console.log(`[${req.method} ${req.url}] ${diff}ms`);
      }),
    );
  }
}
