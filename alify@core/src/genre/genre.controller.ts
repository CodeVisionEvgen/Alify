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

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
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
