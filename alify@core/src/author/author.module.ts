import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './entities/author.entity';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  imports: [
    MongooseModule.forFeature([
      {
        schema: AuthorSchema,
        name: Author.name,
      },
    ]),
  ],
})
export class AuthorModule {}
