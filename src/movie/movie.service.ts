import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  getManyMovies(title?: string) {
    return this.movieRepository.find({ where: { title } });
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('존재하지 않는 ID의 영화입니다.');

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save(createMovieDto);

    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    await this.movieRepository.update({ id }, updateMovieDto);
    const newMovie = await this.movieRepository.findOne({ where: { id } });

    return newMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    await this.movieRepository.delete(id);

    return id;
  }
}
