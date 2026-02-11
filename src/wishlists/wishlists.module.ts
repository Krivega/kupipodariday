import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wish } from '@/wishes/entities/wish.entity';
import { WishesModule } from '@/wishes/wishes.module';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish]),
    forwardRef(() => {
      return WishesModule;
    }),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
