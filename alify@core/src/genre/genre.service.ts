import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './entities/genre.entity';
import { Model } from 'mongoose';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) readonly genreModel: Model<Genre>) {}
  create(createGenreDto: CreateGenreDto) {
    return new this.genreModel(createGenreDto).save();
  }

  findAll() {
    return `This action returns all genre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
