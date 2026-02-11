import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, In } from 'typeorm';

import { Wish } from '@/wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

import type { UserIdRef } from '@/users/types/user-id-ref.type';

@Injectable()
export class WishlistsService {
  public constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  public createWishlistEntity(
    createWishlistDto: CreateWishlistDto & { owner: UserIdRef },
  ): Wishlist {
    const { itemsId, owner, ...wishlistData } = createWishlistDto;

    return this.wishListRepository.create({
      ...wishlistData,
      owner,
    });
  }

  // ——— Pure CRUD ———

  public async findOneWishlistEntity(
    filter: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist | null> {
    return this.wishListRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findManyWishlistEntity(
    filter?: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist[]> {
    return this.wishListRepository.find({
      ...options,
      where: filter,
    });
  }

  public async saveWishlistEntity(wishlist: Wishlist): Promise<Wishlist> {
    return this.wishListRepository.save(wishlist);
  }

  public async updateWishlistEntity(
    filter: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishListRepository.update(filter, updateWishlistDto);
  }

  public async removeWishlistEntity(filter: FindOptionsWhere<Wishlist>) {
    return this.wishListRepository.delete(filter);
  }

  public async linkItemsToWishlist(
    wishlist: Wishlist,
    itemsId: number[],
    ownerId: number,
  ): Promise<void> {
    if (itemsId.length === 0) {
      return;
    }

    const wishes = await this.wishRepository.find({
      where: {
        id: In(itemsId),
        owner: { id: ownerId },
      },
    });

    await this.wishListRepository.save({
      ...wishlist,
      items: [...(wishlist.items ?? []), ...wishes],
    });
  }
}
