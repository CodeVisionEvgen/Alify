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

  async updateManyByIds(ids: string[], content: UpdateMusicDto) {
    if (ids) {
      const promises = ids.map((id: string) =>
        this.musicModel.updateOne({ _id: id }, content),
      );
      return await Promise.all(promises);
    }
  }

  findByGenre(genre: string) {
    return this.baseAggregation({ genre }).exec();
  }

  baseAggregation(matchCondition = {}) {
    return this.musicModel
      .aggregate()
      .match(matchCondition)
      .sort({ createdAt: -1 })
      .addFields({
        author: {
          $cond: {
            if: { $gt: [{ $strLenCP: { $ifNull: ['$author', ''] } }, 0] },
            then: { $toObjectId: '$author' },
            else: null,
          },
        },
      })
      .lookup({
        from: 'authors',
        as: 'authorTemp',
        localField: 'author',
        foreignField: '_id',
      })
      .unwind({ path: '$authorTemp', preserveNullAndEmptyArrays: true })
      .addFields({
        author: '$authorTemp.name',
      })
      .project({
        authorTemp: 0,
      })
      .addFields({
        genre: {
          $cond: {
            if: { $gt: [{ $strLenCP: { $ifNull: ['$genre', ''] } }, 0] },
            then: { $toObjectId: '$genre' },
            else: null,
          },
        },
      })
      .lookup({
        from: 'genres',
        as: 'genreTemp',
        localField: 'genre',
        foreignField: '_id',
      })
      .unwind({
        path: '$genreTemp',
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        genre: '$genreTemp.name',
      })
      .project({
        genreTemp: 0,
      });
  }

  async findAll() {
    const musics = await this.baseAggregation().exec();
    return musics;
  }

  async findWithoutGenres() {
    const musics = await this.baseAggregation({
      $or: [{ genre: '' }, { genre: null }],
    }).exec();
    return musics;
  }

  async findOneByName(name: string) {
    const musics = await this.baseAggregation({ name }).exec();
    return musics.length ? musics[0] : null;
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
