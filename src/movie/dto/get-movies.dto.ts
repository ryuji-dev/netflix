// import { PagePaginationDto } from 'src/common/dto/page-pagination.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetMoviesDto extends CursorPaginationDto {
  @IsString()
  @IsOptional()
  title?: string;
}
