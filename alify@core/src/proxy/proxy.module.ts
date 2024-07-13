import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { DriveModule } from 'src/drive/drive.module';

@Module({
  controllers: [ProxyController],
  imports: [DriveModule],
})
export class ProxyModule {}
