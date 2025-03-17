import { Exclude, Expose } from 'class-transformer';

export class Movie {
  @Expose()
  id: number;

  @Expose()
  title: string;

  genre: string;
}
