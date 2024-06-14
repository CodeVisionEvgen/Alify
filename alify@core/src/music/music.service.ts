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

  findAll() {
    return this.musicModel.find();
  }

  findOneByName(name: string) {
    return `This action returns a #${name} music`;
  }

  updateByName(name: string, updateMusicDto: UpdateMusicDto) {
    return this.musicModel.updateOne({ name }, updateMusicDto);
  }

  removeByName(name: string) {
    return this.musicModel.deleteOne({ name });
  }
}
