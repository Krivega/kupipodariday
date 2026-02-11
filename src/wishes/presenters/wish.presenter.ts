import { Injectable } from '@nestjs/common';

import { OfferPresenter } from '@/offers/presenters/offer.presenter';
import { UserPresenter } from '@/users/presenters/user.presenter';
import { CreateWishDto } from '../dto/create-wish.dto';
import { UpdateWishDto } from '../dto/update-wish.dto';
import { Wish } from '../entities/wish.entity';
import {
  wishChangePriceForbiddenException,
  wishForbiddenException,
  wishNotFoundException,
} from '../exceptions';
import { WishesService } from '../wishes.service';

import type { User } from '@/users/entities/user.entity';
import type { WishPartialDto } from '../dto/wish-partial.dto';
import type { WishResponseDto } from '../dto/wish-response.dto';

const WISH_VIEW_RELATIONS = ['owner', 'offers', 'offers.user'] as const;
const WISH_OWNER_RELATION = ['owner'] as const;

@Injectable()
export class WishPresenter {
  public constructor(
    private readonly offerPresenter: OfferPresenter,
    private readonly userPresenter: UserPresenter,
    private readonly wishesService: WishesService,
  ) {}

  public async findManyLast(
    currentUserId: number,
    take = 40,
  ): Promise<WishResponseDto[]> {
    const wishes = await this.wishesService.findManyWishEntity(undefined, {
      relations: [...WISH_VIEW_RELATIONS],
      take,
      order: { createdAt: 'DESC' },
    });

    return wishes.map((wish) => {
      return this.buildWishView(wish, currentUserId);
    });
  }

  public async findManyTop(
    currentUserId: number,
    take = 20,
  ): Promise<WishResponseDto[]> {
    const wishes = await this.wishesService.findManyWishEntity(undefined, {
      relations: [...WISH_VIEW_RELATIONS],
      take,
      order: { copied: 'DESC' },
    });

    return wishes.map((wish) => {
      return this.buildWishView(wish, currentUserId);
    });
  }

  public async findOneForView(
    id: number,
    currentUserId: number,
  ): Promise<WishResponseDto | undefined> {
    const wish = await this.wishesService.findOneWishEntity(
      { id },
      { relations: [...WISH_VIEW_RELATIONS] },
    );

    if (!wish) {
      return undefined;
    }

    return this.buildWishView(wish, currentUserId);
  }

  public async findOneForOwnerCheck(id: number): Promise<Wish | null> {
    return this.wishesService.findOneWishEntity(
      { id },
      { relations: [...WISH_OWNER_RELATION] },
    );
  }

  public async create(
    createWishDto: CreateWishDto & { owner: { id: number } },
  ): Promise<WishResponseDto> {
    const wish = await this.wishesService.createWish({
      ...createWishDto,
      owner: createWishDto.owner as User,
    });
    const full = await this.wishesService.findOneWishEntity(
      { id: wish.id },
      { relations: [...WISH_VIEW_RELATIONS] },
    );

    if (!full) {
      throw wishNotFoundException;
    }

    return this.buildWishView(full, createWishDto.owner.id);
  }

  public async update(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<void> {
    const wish = await this.findOneForOwnerCheck(id);

    if (!wish) {
      throw wishNotFoundException;
    }

    if (wish.owner.id !== userId) {
      throw wishForbiddenException;
    }

    if (wish.raised > 0) {
      throw wishChangePriceForbiddenException;
    }

    await this.wishesService.updateWishEntity({ id }, updateWishDto);
  }

  public async remove(id: number, userId: number): Promise<WishResponseDto> {
    const wish = await this.findOneForOwnerCheck(id);

    if (!wish) {
      throw wishNotFoundException;
    }

    if (wish.owner.id !== userId) {
      throw wishForbiddenException;
    }

    if (wish.raised > 0) {
      throw wishChangePriceForbiddenException;
    }

    const fullWish = await this.wishesService.findOneWishEntity(
      { id },
      { relations: [...WISH_VIEW_RELATIONS] },
    );

    if (!fullWish) {
      throw wishNotFoundException;
    }

    const view = this.buildWishView(fullWish, userId);

    await this.wishesService.removeWishEntity({ id });

    return view;
  }

  public async copy({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<WishResponseDto | undefined> {
    const wish = await this.wishesService.findOneWishEntity({ id });

    if (!wish) {
      return undefined;
    }

    await this.wishesService.updateWishEntity(
      { id },
      { copied: wish.copied + 1 },
    );

    const newWish = await this.wishesService.createWish({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: userId } as User,
    });

    const full = await this.wishesService.findOneWishEntity(
      { id: newWish.id },
      { relations: [...WISH_VIEW_RELATIONS] },
    );

    if (!full) {
      throw wishNotFoundException;
    }

    return this.buildWishView(full, userId);
  }

  public buildWishView(wish: Wish, currentUserId: number): WishResponseDto {
    const raised = this.offerPresenter.calculateRaised(
      wish.offers,
      currentUserId,
    );

    return {
      id: wish.id,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      raised,
      description: wish.description,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      owner: this.userPresenter.toProfile(wish.owner),
      offers: this.offerPresenter.buildOffersView(wish.offers, currentUserId),
    };
  }

  public buildWishPartialView(
    wish: Wish,
    currentUserId: number,
  ): WishPartialDto {
    const raised = this.offerPresenter.calculateRaised(
      wish.offers,
      currentUserId,
    );

    return {
      id: wish.id,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: Number(wish.price),
      raised,
      copied: wish.copied,
      description: wish.description,
    };
  }
}
