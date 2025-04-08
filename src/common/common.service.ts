import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PagePaginationDto } from './dto/page-pagination.dto';
import { ObjectLiteral } from 'typeorm';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

@Injectable()
export class CommonService {
  constructor() {}

  applyPagePaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: PagePaginationDto,
  ) {
    const { page, take } = dto;
    qb.skip((page - 1) * take).take(take);
  }

  async applyCursorPaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationDto,
  ) {
    let { order } = dto;
    const { cursor, take } = dto;
    if (cursor) {
      const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      const cursorObj = JSON.parse(decodedCursor) as {
        order: string[];
        values: Record<string, unknown>;
      };
      order = cursorObj.order;

      const { values } = cursorObj;
      const columns = Object.keys(values);
      const comparisonOperator = order.some((o) => o.endsWith('DESC'))
        ? '<'
        : '>';
      const whereConditions = columns.map((c) => `${qb.alias}.${c}`).join(',');
      const whereParams = columns.map((c) => `:${c}`).join(',');

      qb.where(
        `(${whereConditions}) ${comparisonOperator} (${whereParams})`,
        values,
      );
    }

    // ["likeCount_DESC", "id_DESC"]
    for (let i = 0; i < order.length; i++) {
      const [column, direction] = order[i].split('_');
      if (direction !== 'ASC' && direction !== 'DESC')
        throw new BadRequestException(
          'order는 ASC 또는 DESC로 설정해야 합니다.',
        );

      if (i === 0) qb.orderBy(`${qb.alias}.${column}`, direction);
      else qb.addOrderBy(`${qb.alias}.${column}`, direction);
    }
    qb.take(take);

    const results = await qb.getMany();
    const nextCursor = this.generateNextCurosr(results, order);

    return { qb, nextCursor };
  }

  generateNextCurosr<T>(results: T[], order: string[]): string | null {
    if (results.length === 0) return null;

    /**
     * {
     *  values : {
     *    id: 27
     *  },
     *  order: ['id_DESC']
     * }
     */

    const lastItem = results[results.length - 1];
    const values = {};

    order.forEach((columnOrder) => {
      const [column] = columnOrder.split('_');
      values[column] = (lastItem as Record<string, unknown>)[column];
    });

    const cursorObj = { values, order };
    const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString(
      'base64',
    );

    return nextCursor;
  }
}
