import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  genre?: string;

  // @IsDefined() -> null || undefined
  // @IsOptional() -> ?타입으로 처리
  // @Equals('test') -> 값이 test만 가능
  // @NotEquals('test') -> 값이 test가 아니어야 함
  // @IsEmpty() -> null || undefined || ''
  // @IsNotEmpty() -> null || undefined || '' 이 아니어야 함
  // @IsIn(['test', 'test2']) -> 값이 test 또는 test2 중 하나여야 함
  // @IsNotIn(['test', 'test2']) -> 값이 test 또는 test2 중 하나가 아니어야 함

  // @IsBoolean() -> true || false
  // @IsString() -> 문자열
  // @IsNumber() -> 숫자
  // @IsInt() -> 정수
  // @IsArray() -> 배열
  // @IsEnum(MovieGenre) -> 열거형
  // @IsDateString() -> 날짜 문자열
}
