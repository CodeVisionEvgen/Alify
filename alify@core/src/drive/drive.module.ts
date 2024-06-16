import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';

@Module({
  providers: [DriveService],
  exports: [DriveService],
})
export class DriveModule {}
