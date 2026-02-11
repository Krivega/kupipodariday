import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import {
  offerAlreadyFundedException,
  offerAmountTooBigException,
  offerForOwnWishForbiddenException,
} from '@/offers/exceptions';
import { wishNotFoundException } from '@/wishes/exceptions';
import { WishesService } from '@/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

import type { User } from '@/users/entities/user.entity';
import type { Wish } from '@/wishes/entities/wish.entity';

export type OfferView = {
  id: number;
  amount: number;
  hidden: boolean;
  item: Wish;
  user?: {
    id: number;
    username: string;
    about: string;
    avatar: string;
  };
};

const hasVisibleOffer = (offer: Offer, currentUserId: number) => {
  return !offer.hidden || offer.user.id === currentUserId;
};

@Injectable()
export class OffersService {
  public constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @Inject(
      forwardRef(() => {
        return WishesService;
      }),
    )
    private readonly wishesService: WishesService,
  ) {}

  public async create(
    createOfferDto: CreateOfferDto & { user: { id: number } },
  ): Promise<Offer> {
    const wish = await this.wishesService.findOne(
      { id: createOfferDto.itemId },
      { relations: ['owner', 'offers', 'offers.user'] },
    );

    if (!wish) {
      throw wishNotFoundException;
    }

    this.ensureUserCanContributeToWish({
      wish,
      amount: createOfferDto.amount,
      user: createOfferDto.user,
    });

    const offer = this.offersRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden ?? false,
      item: { id: wish.id } as Wish,
      user: { id: createOfferDto.user.id } as User,
    });

    return this.offersRepository.save(offer);
  }

  public async findOne(
    filter: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer | null> {
    return this.offersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    filter?: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer[]> {
    return this.offersRepository.find({
      ...options,
      where: filter,
    });
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public buildOffersViewForUser(offers: Offer[], currentUserId: number) {
    return offers.filter((offer) => {
      return hasVisibleOffer(offer, currentUserId);
    });
  }

  /**
   * Считает сумму собранных средств как сумму заявок других пользователей.
   */
  public calculateRaisedFromOffers(
    offers: Offer[],
    currentUserId: number,
  ): number {
    return this.buildOffersViewForUser(offers, currentUserId).reduce(
      (sum, offer) => {
        return sum + Number(offer.amount);
      },
      0,
    );
  }

  /**
   * Список заявок для текущего пользователя: для чужих заявок с hidden=true
   */
  public async findManyForUser(currentUserId: number): Promise<OfferView[]> {
    const offers = await this.offersRepository.find({
      relations: ['user', 'item'],
      order: { createdAt: 'DESC' },
    });

    return this.buildOffersViewForUser(offers, currentUserId);
  }

  /**
   * Один заявка по id с учётом hidden для текущего пользователя.
   */
  public async findOneForUser(
    id: number,
    currentUserId: number,
  ): Promise<OfferView | undefined> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer || !hasVisibleOffer(offer, currentUserId)) {
      return undefined;
    }

    return offer;
  }

  private ensureUserCanContributeToWish({
    wish,
    amount,
    user,
  }: {
    wish: Wish;
    amount: number;
    user: { id: number };
  }) {
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
}
