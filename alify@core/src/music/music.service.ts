import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Music } from './entities/music.entity';
import { Model } from 'mongoose';
import { MUSIC_IS_EXISTS } from 'consts/music.consts';

@Injectable()
export class MusicService {
  constructor(@InjectModel(Music.name) readonly musicModel: Model<Music>) {}
  async create(createMusicDto: CreateMusicDto) {
    const music = await this.musicModel.findOne({ name: createMusicDto.name });
    if (music)
      throw new ConflictException(MUSIC_IS_EXISTS(createMusicDto.name));
    return new this.musicModel(createMusicDto).save();
  }

  async findAll() {
    const musics = await this.musicModel
      .aggregate()
      .match({})
      .sort({ name: 1 })
      .addFields({
        author: {
          $toObjectId: '$author',
        },
      })
      .lookup({
        from: 'authors',
        as: 'authorTemp',
        localField: 'author',
        foreignField: '_id',
      })
      .unwind('authorTemp')
      .addFields({
        author: '$authorTemp.name',
      })
      .project({
        authorTemp: 0,
      })
      .addFields({
        genre: {
          $toObjectId: '$genre',
        },
      })
      .lookup({
        from: 'genres',
        as: 'genreTemp',
        localField: 'genre',
        foreignField: '_id',
      })
      .unwind('genreTemp')
      .addFields({
        genre: '$genreTemp.name',
      })
      .project({
        genreTemp: 0,
      });
    return musics;
  }

  findOneByName(name: string) {
    return `This action returns a #${name} music`;
  }

  updateByName(name: string, updateMusicDto: UpdateMusicDto) {
    return this.musicModel.updateOne({ name }, updateMusicDto);
  }

  updateManyByAuthor(author: string, updateMusicDto: UpdateMusicDto) {
    return this.musicModel.updateMany({ author }, updateMusicDto);
  }

  removeByName(name: string) {
    return this.musicModel.deleteOne({ name });
  }
}
