import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MusicDocument = Document<Music>;

@Schema({
  timestamps: true,
})
export class Music {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    default: null,
  })
  genre: string;
  @Prop({
    required: true,
  })
  url: string;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
