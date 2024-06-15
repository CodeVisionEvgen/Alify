import { IsOptional, IsString } from 'class-validator';

export class CreateMusicDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsString()
  genre?: string;
  url: string;
}
