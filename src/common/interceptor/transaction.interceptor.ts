import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';

interface RequestWithQueryRunner extends Request {
  queryRunner: QueryRunner;
}

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<RequestWithQueryRunner>();
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();
        throw e;
      }),
      tap({
        next: () => {
          void qr.commitTransaction().then(() => qr.release());
        },
        error: () => {
          void qr.rollbackTransaction().then(() => qr.release());
        },
      }),
    );
  }
}
