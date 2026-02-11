import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/users/users.module';
import { Wish } from '@/wishes/entities/wish.entity';
import { WishesModule } from '@/wishes/wishes.module';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistPresenter } from './presenters/wishlist.presenter';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish]),
    UsersModule,
    forwardRef(() => {
      return WishesModule;
    }),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService, WishlistPresenter],
  exports: [WishlistsService],
})
export class WishlistsModule {}
