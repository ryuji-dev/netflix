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

  // @IsDivisibleBy(2) -> 2로 나누어 떨어져야 함
  // @IsPositive() -> 양수
  // @IsNegative() -> 음수
  // @IsZero() -> 0
  // @Min(10) -> 최소 10 이상
  // @Max(10) -> 최대 10 이하

  // @Contains('test') -> 'test' 포함
  // @IsNotContains('test') -> 'test' 포함되지 않음
  // @IsAlphanumeric() -> 알파벳 또는 숫자
  // @IsCreditCard() -> 신용카드 번호
  // @IsHexColor() -> 16진수 색상
  // @MaxLength(10) -> 최대 10글자
  // @MinLength(10) -> 최소 10글자
  // @IsUUID() -> UUID
  // @IsLatitude() -> 위도
  // @IsLongitude() -> 경도
}
