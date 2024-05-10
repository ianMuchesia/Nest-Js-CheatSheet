import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config/swagger';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  // attaches cookies to request object
  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);
  await app.listen(4000,() => console.log('Server is running on http://localhost:4000'));
}
bootstrap();


