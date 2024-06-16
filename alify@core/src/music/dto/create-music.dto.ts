import { IsOptional, IsString } from 'class-validator';

export class CreateMusicDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsString()
  genre?: string;
  @IsOptional()
  @IsString()
  author?: string;
  url: string;
}
