import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configuration, { schema } from '@/configuration';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from './auth/auth.module';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schema,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
