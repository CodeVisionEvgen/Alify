import { Module } from '@nestjs/common';
import { BoxService } from './box.service';

@Module({
  providers: [BoxService],
  exports: [BoxService],
})
export class BoxModule {}
