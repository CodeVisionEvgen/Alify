import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Дозволити доступ з усіх джерел
  app.enableCors({
    origin: '*', // Дозволити всі джерела
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Дозволені методи HTTP
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(1488);
}
bootstrap();
