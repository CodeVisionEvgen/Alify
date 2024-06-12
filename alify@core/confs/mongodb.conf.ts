import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const MongoFactoryConf = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  const uri = `${configService.get('MONGODB_PROTOCOL')}${configService.get('MONGODB_URL')}`;
  return {
    pass: configService.get('MONGODB_PWD'),
    user: configService.get('MONGODB_NICK'),
    uri,
  };
};
