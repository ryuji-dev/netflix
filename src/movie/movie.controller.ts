import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Req,
  // UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/user/entity/user.entity';
import { GetMoviesDto } from './dto/get-movies.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'typeorm';
import { Request } from 'express';
import {
  FileFieldsInterceptor,
  // FileInterceptor,
  // FilesInterceptor,
} from '@nestjs/platform-express';
// import { ResponseTimeInterceptor } from 'src/common/interceptor/response-time.interceptor';

interface RequestWithQueryRunner extends Request {
  queryRunner: QueryRunner;
}

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  // @UseInterceptors(CacheInterceptor)
  getMovies(@Query() dto: GetMoviesDto) {
    return this.movieService.findAll(dto);
  }

  @Get(':id')
  @Public()
  getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.findOne(id);
  }

  @Post()
  @RBAC(Role.admin)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'moive', maxCount: 1 },
        { name: 'poster', maxCount: 2 },
      ],
      {
        limits: {
          fileSize: 1024 * 1024 * 5, // 5MB
        },
        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'video/mp4') {
            return cb(
              new BadRequestException('mp4 파일만 업로드 가능합니다.'),
              false,
            );
          }

          return cb(null, true);
        },
      },
    ),
  )
  postMovie(
    @Body() body: CreateMovieDto,
    @Req() req: RequestWithQueryRunner,
    @UploadedFiles()
    files: { moive?: Express.Multer.File[]; poster?: Express.Multer.File[] },
  ) {
    console.log('---------------------');
    console.log(files);

    return this.movieService.create(body, req.queryRunner);
  }

  @Patch(':id')
  @RBAC(Role.admin)
  updateMovie(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.update(+id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: string) {
    return this.movieService.remove(+id);
  }
}
