import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
@Module({
  providers: [ImagekitService],
})
export class ImagekitModule {
  static registerAsync(options: Provider): DynamicModule {
    return {
      module: ImagekitModule,
      providers: [options, ImagekitService],
      exports: [ImagekitService],
    };
  }
}
