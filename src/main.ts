import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //NestFactory allows to create an app instance. Second arg we enable cors.
  const app = await NestFactory.create(AppModule, { cors: true });
  //use configservice to store variables such as the application port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  //security HTTP headers
  app.use(helmet());
  //pipes applied to every route handler across the entire application.
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
