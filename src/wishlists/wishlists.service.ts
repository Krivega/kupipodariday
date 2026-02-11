import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, In } from 'typeorm';

import { Wish } from '@/wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

import type { User } from '@/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  public constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  public createWishlistEntity(
    createWishlistDto: CreateWishlistDto & { owner: User },
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
    const { itemsId: _itemsId, owner: _owner, ...columns } =
      updateWishlistDto as UpdateWishlistDto & {
        itemsId?: number[];
        owner?: unknown;
      };
    return this.wishListRepository.update(filter, columns);
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

    wishlist.items = [...(wishlist.items ?? []), ...wishes];
    await this.wishListRepository.save(wishlist);
  }
}
