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
    return this.wishListRepository.update(filter, updateWishlistDto);
  }

  public async removeWishlistEntity(filter: FindOptionsWhere<Wishlist>) {
    return this.wishListRepository.delete(filter);
  }

  // ——— Business logic & data processing ———

  public async create(createWishlistDto: CreateWishlistDto & { owner: User }) {
    const wishlist = this.createWishlistEntity(createWishlistDto);
    const savedWishlist = await this.saveWishlistEntity(wishlist);

    await this.linkItemsToWishlist(
      savedWishlist,
      createWishlistDto.itemsId ?? [],
      createWishlistDto.owner.id,
    );

    const result = await this.findOneWishlistEntity(
      { id: savedWishlist.id },
      {
        relations: ['owner', 'items', 'items.owner', 'items.offers'],
      },
    );

    if (!result) {
      throw wishlistNotFoundException;
    }

    return this.buildWishlistViewForUser(result, createWishlistDto.owner.id);
  }

  public async findMany(
    currentUserId: number,
    filter?: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ) {
    const wishlists = await this.findManyWishlistEntity(filter, options);

    return wishlists.map((wishlist) => {
      return this.buildWishlistViewForUser(wishlist, currentUserId);
    });
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

  // ——— Private helpers ———

  private async linkItemsToWishlist(
    wishlist: Wishlist,
    itemsId: number[],
    ownerId: number,
  ): Promise<void> {
    if (itemsId.length === 0) {
      return;
    }

    await this.wishRepository.update(
      {
        id: In(itemsId),
        owner: { id: ownerId },
      },
      { wishlist },
    );
  }
}
