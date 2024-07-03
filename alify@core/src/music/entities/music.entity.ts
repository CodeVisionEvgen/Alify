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
  author: string | null;
  @Prop({
    default: null,
  })
  genre: string | null;
  @Prop({
    required: true,
  })
  url: string;
  @Prop({
    default: null,
  })
  thumbnail: string;
}

export const MusicSchema = SchemaFactory.createForClass(Music);
