import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Movie {
  id: number;
  title: string;
}

@Controller('movie')
export class AppController {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
    },
    {
      id: 2,
      title: '반지의 제왕',
    },
  ];

  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies() {
    return this.movies;
  }

  @Get(':id')
  getMovie() {
    return {
      id: 1,
      title: '해리포터',
      characters: ['해리포터', '헤르미온느 그레인저', '론 위즐리'],
    };
  }

  @Post()
  postMovie() {
    return {
      id: 3,
      title: '어벤져스',
      characters: ['아이언맨', '캡틴 아메리카', '토르'],
    };
  }

  @Patch(':id')
  patchMovie() {
    return {
      id: 3,
      title: '어벤져스',
      characters: ['아이언맨', '캡틴 아메리카', '토르', '블랙 위도우'],
    };
  }

  @Delete(':id')
  deleteMovie() {
    return 3;
  }
}
