import { Injectable } from '@nestjs/common';
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

function buildOfferViewForUser(offer: Offer, currentUserId: number): OfferView {
  const user = offer.user as User | undefined;
  const isOwn = user?.id === currentUserId;
  const hideUser = offer.hidden && !isOwn;

  const view: OfferView = {
    id: offer.id,
    amount: offer.amount,
    hidden: offer.hidden,
    item: offer.item,
  };

  if (!hideUser && user) {
    view.user = {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }

  return view;
}

@Injectable()
export class OffersService {
  public constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
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

  /**
   * Список заявок для текущего пользователя: для чужих заявок с hidden=true
   * данные скидывающегося не возвращаются.
   */
  public async findManyForUser(currentUserId: number): Promise<OfferView[]> {
    const offers = await this.offersRepository.find({
      relations: ['user', 'item'],
      order: { createdAt: 'DESC' },
    });

    return offers.map((offer) => {
      return buildOfferViewForUser(offer, currentUserId);
    });
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

    if (!offer) {
      return undefined;
    }

    return buildOfferViewForUser(offer, currentUserId);
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

    const raised = this.wishesService.calculateRaisedFromOffers(wish.offers);

    if (raised >= wish.price) {
      throw offerAlreadyFundedException;
    }

    if (raised + amount > wish.price) {
      throw offerAmountTooBigException;
    }
  }
}
