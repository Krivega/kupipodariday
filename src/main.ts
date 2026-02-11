// Load .env before AppModule so ConfigModule sees process.env
// eslint-disable-next-line import/order -- must run before AppModule
import '@/load-env';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { generateSwagger } from './generateSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.GENERATE_SWAGGER === '1') {
    await generateSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
