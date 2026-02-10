import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

import type { Offer } from '@/offers/entities/offer.entity';
import type { User } from '@/users/entities/user.entity';

@Injectable()
export class WishesService {
  public constructor(
    @InjectRepository(Wish)
    private readonly usersRepository: Repository<Wish>,
  ) {}

  public async create(
    createWishDto: CreateWishDto & { owner: User },
  ): Promise<Wish> {
    const wish = this.usersRepository.create(createWishDto);

    return this.usersRepository.save(wish);
  }

  public async findOne(
    filter: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish | null> {
    return this.usersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    filter: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async update(
    filter: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto,
  ) {
    return this.usersRepository.update(filter, updateWishDto);
  }

  public async remove(filter: FindOptionsWhere<Wish>) {
    return this.usersRepository.delete(filter);
  }

  /**
   * Считает сумму собранных средств как сумму заявок других пользователей.
   * Поле raised в сущности не используется напрямую, сумма вычисляется из offers.
   */
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public calculateRaisedFromOffers(offers: Offer[]): number {
    return offers.reduce((sum, offer) => {
      return sum + Number(offer.amount);
    }, 0);
  }

  /**
   * Формирует DTO подарка для конкретного пользователя с учётом того,
   * свой это подарок или чужой, а также скрытых заявок.
   */
  public buildWishViewForUser(wish: Wish, currentUserId: number) {
    const isOwner = wish.owner.id === currentUserId;
    const raised = this.calculateRaisedFromOffers(wish.offers as Offer[]);

    const mapUser = (u: User) => {
      return {
        id: u.id,
        username: u.username,
        about: u.about,
        avatar: u.avatar,
      };
    };

    if (isOwner) {
      return {
        id: wish.id,
        name: wish.name,
        image: wish.image,
        link: wish.link,
        price: wish.price,
        raised,
        owner: mapUser(wish.owner),
        participants: wish.offers.map((offer) => {
          return {
            id: offer.id,
            amount: offer.amount,
            hidden: offer.hidden,
            user: mapUser(offer.user),
          };
        }),
      };
    }

    return {
      id: wish.id,
      name: wish.name,
      price: wish.price,
      raised,
      link: wish.link,
      description: wish.description,
      owner: mapUser(wish.owner),
      participants: wish.offers
        .filter((offer) => {
          return !offer.hidden;
        })
        .map((offer) => {
          return {
            id: offer.id,
            amount: offer.amount,
            user: mapUser(offer.user),
          };
        }),
    };
  }
}
