// Load .env before AppModule so ConfigModule sees process.env
// eslint-disable-next-line import/order -- must run before AppModule
import '@/load-env';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
