import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './entities/genre.entity';
import { Model } from 'mongoose';
import { GENRE_IS_EXISTS } from 'consts/genre.consts';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) readonly genreModel: Model<Genre>) {}
  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.genreModel.findOne({ name: createGenreDto.name });
    if (genre)
      throw new ConflictException(GENRE_IS_EXISTS(createGenreDto.name));
    return new this.genreModel(createGenreDto).save();
  }

  findAll() {
    return this.genreModel.find();
  }

  findOneByName(name: string) {
    return this.genreModel.findOne({ name });
  }

  updateByName(name: string, updateGenreDto: UpdateGenreDto) {
    return this.genreModel.updateOne({ name }, updateGenreDto);
  }

  removeByName(name: string) {
    return this.genreModel.deleteOne({ name });
  }
}
