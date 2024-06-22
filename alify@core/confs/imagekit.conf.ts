import { ConfigService } from '@nestjs/config';
import { ImageKitModuleOptions } from 'src/imagekit/imagekit-config.interface';

export const ImageKitConfigFactory = (
  configService: ConfigService,
): ImageKitModuleOptions => {
  return {
    publicKey: configService.get('IMAGE_KIT_PUBLIC_TOKEN'),
    privateKey: configService.get('IMAGE_KIT_SECRET_TOKEN'),
    urlEndpoint: configService.get('IMAGE_KIT_URL'),
  };
};
