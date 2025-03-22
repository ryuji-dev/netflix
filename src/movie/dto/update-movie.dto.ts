import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsOptional()
  genreIds?: number[];

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  directorId?: number;
}
