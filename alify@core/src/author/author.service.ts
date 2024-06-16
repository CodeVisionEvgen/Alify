import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from './entities/author.entity';
import { Model } from 'mongoose';
import { MusicService } from 'src/music/music.service';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<Author>,
    private readonly musicService: MusicService,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorModel.findOne({
      name: createAuthorDto.name,
    });
    if (author) throw new ConflictException();
    return new this.authorModel(createAuthorDto).save();
  }

  findAll() {
    return this.authorModel.find().sort({
      name: 1,
    });
  }

  async findOneByName(name: string) {
    const author = await this.authorModel
      .aggregate()
      .match({ name })
      .sort({ name: 1 })
      .addFields({ authorId: { $toString: '$_id' } })
      .lookup({
        from: 'musics',
        as: 'music',
        localField: 'authorId',
        foreignField: 'author',
      })
      .project({
        authorId: 0,
      });
    return author[0];
  }

  async updateByName(name: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorModel.updateOne({ name }, updateAuthorDto);
  }

  async removeByName(name: string) {
    const author = await this.authorModel.findOne({ name });
    await this.musicService.updateManyByAuthor(author._id.toString(), {
      author: null,
    });
    return this.authorModel.deleteOne({ name });
  }
}
