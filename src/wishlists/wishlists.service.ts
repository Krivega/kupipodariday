/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Injectable } from '@nestjs/common';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  public create(_createWishlistDto: CreateWishlistDto) {
    return 'This action adds a new wishlist';
  }

  public findAll() {
    return 'This action returns all wishlists';
  }

  public findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  public update(id: number, _updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  public remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
