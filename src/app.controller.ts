import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies() {
    return [
      {
        id: 1,
        name: '해리포터',
        characters: ['해리포터', '헤르미온느 그레인저', '론 위즐리'],
      },
      {
        id: 2,
        name: '반지의 제왕',
        characters: ['간달프', '프로도', '골룸'],
      },
    ];
  }

  @Get()
  getMovie() {
    return {
      id: 1,
      name: '해리포터',
      characters: ['해리포터', '헤르미온느 그레인저', '론 위즐리'],
    };
  }

  @Post()
  postMovie() {
    return {
      id: 3,
      name: '어벤져스',
      characters: ['아이언맨', '캡틴 아메리카', '토르'],
    };
  }

  @Patch()
  patchMovie() {
    return {
      id: 3,
      name: '어벤져스',
      characters: ['아이언맨', '캡틴 아메리카', '토르', '블랙 위도우'],
    };
  }

  @Delete()
  deleteMovie() {
    return 3;
  }
}
