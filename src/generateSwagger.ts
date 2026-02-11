/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// Load .env before AppModule so ConfigModule sees process.env
// eslint-disable-next-line import/order -- must run before AppModule
import '@/load-env';
import nodeFs from 'node:fs';
import nodePath from 'node:path';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import yaml from 'yaml';

import type { INestApplication } from '@nestjs/common';

export async function generateSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('КупиПодариДай')
    .setDescription('API сервиса вишлистов')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addServer('http://localhost:3000', 'Локальный сервер')
    .addServer(
      'https://virtserver.swaggerhub.com/zlocate/KupiPodariDay/1.0.0',
      'SwaggerHub API Auto Mocking',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  await app.close();

  const yamlContent = yaml.stringify(document, { lineWidth: 0 });
  const outputPath = nodePath.resolve(process.cwd(), 'swaggerCurrent.yaml');

  nodeFs.writeFileSync(outputPath, yamlContent, 'utf8');

  console.log(`Swagger spec written to ${outputPath}`);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}
