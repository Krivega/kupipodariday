/* eslint-disable @typescript-eslint/class-methods-use-this */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import {
  offerAlreadyFundedException,
  offerAmountTooBigException,
  offerForOwnWishForbiddenException,
  offerNotFoundException,
} from '@/offers/exceptions';
import { UsersPresenter } from '@/users/users.presenter';
import { WishesPresenter } from '@/wishes/wishes.presenter';
import { WishesService } from '@/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

import type { Wish } from '@/wishes/entities/wish.entity';
import type { OfferResponseDto } from './dto/offer-response.dto';
import type { Offer } from './entities/offer.entity';

const OFFER_VIEW_RELATIONS = ['user', 'item'] as const;

@Injectable()
export class OffersPresenter {
  /* eslint-disable @typescript-eslint/max-params */
  public constructor(
    private readonly offersService: OffersService,
    @Inject(
      forwardRef(() => {
        return WishesPresenter;
      }),
    )
    private readonly wishPresenter: WishesPresenter,
    private readonly wishesService: WishesService,
    private readonly userPresenter: UsersPresenter,
    private readonly dataSource: DataSource,
  ) {}
  /* eslint-enable @typescript-eslint/max-params */

  public async findManyForView(
    currentUserId: number,
  ): Promise<OfferResponseDto[]> {
    const offers = await this.offersService.findManyOfferEntity(undefined, {
      relations: [...OFFER_VIEW_RELATIONS],
      order: { createdAt: 'DESC' },
    });

    return this.buildOffersView(offers, currentUserId);
  }

  public async findOneForView(
    id: number,
    currentUserId: number,
  ): Promise<OfferResponseDto | undefined> {
    const offer = await this.offersService.findOneOfferEntity(
      { id },
      { relations: [...OFFER_VIEW_RELATIONS] },
    );

    if (!offer || !this.hasVisibleOffer(offer, currentUserId)) {
      return undefined;
    }

    return this.buildOfferView(offer);
  }

  public async create(
    createOfferDto: CreateOfferDto & { user: { id: number } },
  ): Promise<OfferResponseDto> {
    const wish = await this.validateCreateOffer(createOfferDto);
    const offer = this.offersService.createOfferEntity(createOfferDto, wish);

    const saved = await this.dataSource.transaction(
      async (manager: EntityManager) => {
        const savedOffer = await this.offersService.saveOfferEntity(
          offer,
          manager,
        );

        await this.wishesService.incrementWishRaised(
          wish.id,
          createOfferDto.amount,
          manager,
        );

        return savedOffer;
      },
    );

    const fullOffer = await this.offersService.findOneOfferEntity(
      { id: saved.id },
      { relations: [...OFFER_VIEW_RELATIONS] },
    );

    if (!fullOffer) {
      throw offerNotFoundException;
    }

    return this.buildOfferView(fullOffer);
  }

  public buildOffersView(
    offers: Offer[] | undefined,
    currentUserId: number,
  ): OfferResponseDto[] {
    return this.getVisibleOffers(offers, currentUserId).map((offer) => {
      return this.buildOfferView(offer);
    });
  }

  public buildOfferView(offer: Offer): OfferResponseDto {
    return {
      id: offer.id,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      amount: offer.amount,
      hidden: offer.hidden,
      item: offer.item,
      user: this.userPresenter.toProfile(offer.user),
    };
  }

  private async validateCreateOffer(
    createOfferDto: CreateOfferDto & { user: { id: number } },
  ): Promise<Wish> {
    const wish = await this.wishPresenter.findOneForOfferValidation(
      createOfferDto.itemId,
    );

    this.ensureUserCanContributeToWish({
      wish,
      amount: createOfferDto.amount,
      user: createOfferDto.user,
    });

    return wish;
  }

  private ensureUserCanContributeToWish({
    wish,
    amount,
    user,
  }: {
    wish: Wish;
    amount: number;
    user: { id: number };
  }): void {
    if (wish.owner.id === user.id) {
      throw offerForOwnWishForbiddenException;
    }

    const raised = Number(wish.raised);

    if (raised >= Number(wish.price)) {
      throw offerAlreadyFundedException;
    }

    if (raised + amount > Number(wish.price)) {
      throw offerAmountTooBigException;
    }
  }

  /**
   * Offer is visible if not hidden OR if current user is the offer's user.
   */
  private hasVisibleOffer(offer: Offer, currentUserId: number): boolean {
    return !offer.hidden || offer.user.id === currentUserId;
  }

  private getVisibleOffers(
    offers: Offer[] | undefined,
    currentUserId: number,
  ): Offer[] {
    return (offers ?? []).filter((offer) => {
      return this.hasVisibleOffer(offer, currentUserId);
    });
  }
}
