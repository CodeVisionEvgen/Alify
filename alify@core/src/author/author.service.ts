import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from './entities/author.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}
  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorModel.findOne({
      name: createAuthorDto.name,
    });
    if (createAuthorDto.name === author.name) throw new ConflictException();
    return new this.authorModel(createAuthorDto).save();
  }

  findAll() {
    return this.authorModel.find();
  }

  findOne(name: string) {
    return this.authorModel.findOne({ name });
  }

  update(name: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorModel.updateOne({ name }, updateAuthorDto);
  }

  remove(name: string) {
    return this.authorModel.deleteOne({ name });
  }
}
