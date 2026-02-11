import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, In } from 'typeorm';

import { toUserProfileResponseDto } from '@/users/dto/user-profile-response.dto';
import { Wish } from '@/wishes/entities/wish.entity';
import { WishesService } from '@/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { wishlistNotFoundException } from './exceptions';

import type { User } from '@/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  public constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly wishesService: WishesService,
  ) {}

  public async create(createWishlistDto: CreateWishlistDto & { owner: User }) {
    const { itemsId, owner, ...wishlistData } = createWishlistDto;
    const wishlist = this.wishListRepository.create({
      ...wishlistData,
      owner,
    });
    const savedWishlist = await this.wishListRepository.save(wishlist);

    const idList = itemsId ?? [];

    if (idList.length > 0) {
      await this.wishRepository.update(
        {
          id: In(idList),
          owner: { id: owner.id },
        },
        { wishlist: savedWishlist },
      );
    }

    const result = await this.wishListRepository.findOne({
      where: { id: savedWishlist.id },
      relations: ['owner', 'items', 'items.owner', 'items.offers'],
    });

    if (!result) {
      throw wishlistNotFoundException;
    }

    return this.buildWishlistViewForUser(result, owner.id);
  }

  public async findOne(
    filter: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist | null> {
    return this.wishListRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    currentUserId: number,
    filter?: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ) {
    const wishlists = await this.wishListRepository.find({
      ...options,
      where: filter,
    });

    return wishlists.map((wishlist) => {
      return this.buildWishlistViewForUser(wishlist, currentUserId);
    });
  }

  public async update(
    filter: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishListRepository.update(filter, updateWishlistDto);
  }

  public buildWishlistViewForUser(wishlist: Wishlist, currentUserId: number) {
    return {
      ...wishlist,
      owner: toUserProfileResponseDto(wishlist.owner),
      items: wishlist.items.map((item) => {
        return this.wishesService.buildWishViewForUser(item, currentUserId);
      }),
    };
  }

  public async remove(filter: FindOptionsWhere<Wishlist>) {
    return this.wishListRepository.delete(filter);
  }
}
