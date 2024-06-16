import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthorDocument = Document<Author>;

@Schema({
  strict: true,
})
export class Author {
  @Prop({
    required: true,
    index: 'text',
  })
  name: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
