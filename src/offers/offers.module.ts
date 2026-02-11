import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/users/users.module';
import { WishesModule } from '@/wishes/wishes.module';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersPresenter } from './offers.presenter';
import { OffersService } from './offers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => {
      return UsersModule;
    }),
    forwardRef(() => {
      return WishesModule;
    }),
  ],
  controllers: [OffersController],
  providers: [OffersService, OffersPresenter],
  exports: [OffersService, OffersPresenter],
})
export class OffersModule {}
