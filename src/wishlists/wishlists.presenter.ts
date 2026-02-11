import { Injectable } from '@nestjs/common';

import { UsersPresenter } from '@/users/users.presenter';
import { WishesPresenter } from '@/wishes/wishes.presenter';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import {
  wishlistForbiddenException,
  wishlistNotFoundException,
} from './exceptions';
import { WishlistsService } from './wishlists.service';

import type { UserIdRef } from '@/users/types/user-id-ref.type';
import type { WishlistResponseDto } from './dto/wishlist-response.dto';

const WISHLIST_VIEW_RELATIONS = [
  'owner',
  'items',
  'items.owner',
  'items.offers',
  'items.offers.user',
] as const;
const WISHLIST_OWNER_RELATION = ['owner'] as const;

@Injectable()
export class WishlistsPresenter {
  public constructor(
    private readonly wishPresenter: WishesPresenter,
    private readonly userPresenter: UsersPresenter,
    private readonly wishlistsService: WishlistsService,
  ) {}

  public async findManyForView(): Promise<WishlistResponseDto[]> {
    const wishlists = await this.wishlistsService.findManyWishlistEntity(
      {},
      {
        relations: [...WISHLIST_VIEW_RELATIONS],
      },
    );

    return wishlists.map((wishlist) => {
      return this.buildWishlistView(wishlist);
    });
  }

  public async findOneForView(
    id: number,
  ): Promise<WishlistResponseDto | undefined> {
    const wishlist = await this.wishlistsService.findOneWishlistEntity(
      { id },
      { relations: [...WISHLIST_VIEW_RELATIONS] },
    );

    if (!wishlist) {
      return undefined;
    }

    return this.buildWishlistView(wishlist);
  }

  public async findOneForOwnerCheck(id: number): Promise<Wishlist | null> {
    return this.wishlistsService.findOneWishlistEntity(
      { id },
      { relations: [...WISHLIST_OWNER_RELATION] },
    );
  }

  public async create(
    createWishlistDto: CreateWishlistDto & { owner: UserIdRef },
  ): Promise<WishlistResponseDto> {
    const wishlist =
      this.wishlistsService.createWishlistEntity(createWishlistDto);
    const savedWishlist =
      await this.wishlistsService.saveWishlistEntity(wishlist);

    const { itemsId } = createWishlistDto;

    if (itemsId) {
      await this.wishlistsService.linkItemsToWishlist(
        savedWishlist,
        itemsId,
        createWishlistDto.owner.id,
      );
    }

    const result = await this.wishlistsService.findOneWishlistEntity(
      { id: savedWishlist.id },
      { relations: [...WISHLIST_VIEW_RELATIONS] },
    );

    if (!result) {
      throw wishlistNotFoundException;
    }

    return this.buildWishlistView(result);
  }

  public async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.findOneForOwnerCheck(id);

    if (!wishlist) {
      throw wishlistNotFoundException;
    }

    if (wishlist.owner.id !== userId) {
      throw wishlistForbiddenException;
    }

    await this.wishlistsService.updateWishlistEntity({ id }, updateWishlistDto);

    const updated = await this.wishlistsService.findOneWishlistEntity(
      { id },
      { relations: [...WISHLIST_VIEW_RELATIONS] },
    );

    if (!updated) {
      throw wishlistNotFoundException;
    }

    return this.buildWishlistView(updated);
  }

  public async remove(
    id: number,
    userId: number,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.findOneForOwnerCheck(id);

    if (!wishlist) {
      throw wishlistNotFoundException;
    }

    if (wishlist.owner.id !== userId) {
      throw wishlistForbiddenException;
    }

    const fullWishlist = await this.wishlistsService.findOneWishlistEntity(
      { id },
      { relations: [...WISHLIST_VIEW_RELATIONS] },
    );

    if (!fullWishlist) {
      throw wishlistNotFoundException;
    }

    const view = this.buildWishlistView(fullWishlist);

    await this.wishlistsService.removeWishlistEntity({ id });

    return view;
  }

  public buildWishlistView(wishlist: Wishlist): WishlistResponseDto {
    return {
      id: wishlist.id,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
      name: wishlist.name,
      description: wishlist.description,
      image: wishlist.image,
      owner: this.userPresenter.toPublicProfile(wishlist.owner),
      items: (wishlist.items ?? []).map((item) => {
        return this.wishPresenter.buildWishPartialView(item);
      }),
    };
  }
}
