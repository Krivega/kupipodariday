import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersModule } from '@/offers/offers.module';
import { UsersModule } from '@/users/users.module';
import { Wish } from './entities/wish.entity';
import { WishPresenter } from './presenters/wish.presenter';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    UsersModule,
    forwardRef(() => {
      return OffersModule;
    }),
  ],
  controllers: [WishesController],
  providers: [WishesService, WishPresenter],
  exports: [WishesService, WishPresenter],
})
export class WishesModule {}
