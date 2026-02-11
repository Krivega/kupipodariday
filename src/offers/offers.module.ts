import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/users/users.module';
import { WishesModule } from '@/wishes/wishes.module';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { OfferPresenter } from './presenters/offer.presenter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    UsersModule,
    forwardRef(() => {
      return WishesModule;
    }),
  ],
  controllers: [OffersController],
  providers: [OffersService, OfferPresenter],
  exports: [OffersService, OfferPresenter],
})
export class OffersModule {}
