/* eslint-disable @typescript-eslint/class-methods-use-this */
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import {
  offerAlreadyFundedException,
  offerAmountTooBigException,
  offerForOwnWishForbiddenException,
  offerNotFoundException,
} from '@/offers/exceptions';
import { UsersPresenter } from '@/users/users.presenter';
import { WishesPresenter } from '@/wishes/wishes.presenter';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

import type { Wish } from '@/wishes/entities/wish.entity';
import type { OfferResponseDto } from './dto/offer-response.dto';
import type { Offer } from './entities/offer.entity';

const OFFER_VIEW_RELATIONS = ['user', 'item'] as const;

@Injectable()
export class OffersPresenter {
  public constructor(
    private readonly offersService: OffersService,
    @Inject(
      forwardRef(() => {
        return WishesPresenter;
      }),
    )
    private readonly wishPresenter: WishesPresenter,
    private readonly userPresenter: UsersPresenter,
  ) {}

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
    const saved = await this.offersService.saveOfferEntity(offer);

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

  public calculateRaised(
    offers: Offer[] | undefined,
    currentUserId: number,
  ): number {
    return this.calculateRaisedFromOffers(offers, currentUserId);
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

    const raised = this.calculateRaisedFromOffers(wish.offers, user.id);

    if (raised >= wish.price) {
      throw offerAlreadyFundedException;
    }

    if (raised + amount > wish.price) {
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

  /**
   * Sum of amounts from offers visible to the current user.
   */
  private calculateRaisedFromOffers(
    offers: Offer[] | undefined,
    currentUserId: number,
  ): number {
    return this.getVisibleOffers(offers, currentUserId).reduce((sum, offer) => {
      return sum + Number(offer.amount);
    }, 0);
  }
}
