import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configuration, { schema } from '@/configuration';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schema,
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
