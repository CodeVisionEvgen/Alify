import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller.js';

@Module({
  controllers: [ProxyController],
})
export class ProxyModule {}
