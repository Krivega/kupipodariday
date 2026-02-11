// Load .env before AppModule so ConfigModule sees process.env
// eslint-disable-next-line import/order -- must run before AppModule
import '@/load-env';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { generateSwagger } from './generateSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  if (process.env.GENERATE_SWAGGER === '1') {
    await generateSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('cors.origins') ?? [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  await app.listen(configService.get('port') ?? 3000);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
