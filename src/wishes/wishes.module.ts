import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersModule } from '@/offers/offers.module';
import { UsersModule } from '@/users/users.module';
import { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesPresenter } from './wishes.presenter';
import { WishesService } from './wishes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    forwardRef(() => {
      return UsersModule;
    }),
    forwardRef(() => {
      return OffersModule;
    }),
  ],
  controllers: [WishesController],
  providers: [WishesService, WishesPresenter],
  exports: [WishesService, WishesPresenter],
})
export class WishesModule {}
