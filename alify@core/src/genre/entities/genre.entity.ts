import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GenreDocument = Document<Genre>;

@Schema({
  strict: true,
})
export class Genre {
  @Prop({
    required: true,
  })
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
