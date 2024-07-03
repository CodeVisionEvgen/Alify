import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { MusicService } from 'src/music/music.service';
import { ConflictException } from '@nestjs/common';
import { GENRE_IS_EXISTS } from 'consts/genre.consts';

@Controller('genre')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
    private readonly musicService: MusicService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createGenreDto: CreateGenreDto) {
    const genreInDb = await this.genreService.findOneByName(
      createGenreDto.name.toLocaleLowerCase(),
    );
    if (genreInDb)
      throw new ConflictException(GENRE_IS_EXISTS(createGenreDto.name));
    const genre = await this.genreService.create(createGenreDto);
    await this.musicService.updateManyByIds(createGenreDto.musics, {
      genre: genre._id.toString(),
    });
    return genre;
  }

  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.genreService.findOneByName(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.updateByName(name, updateGenreDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.genreService.removeByName(name);
  }
}
