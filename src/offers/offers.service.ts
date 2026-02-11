import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

import type { Wish } from '@/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  public constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}

  public async findOneOfferEntity(
    filter: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer | null> {
    return this.offersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findManyOfferEntity(
    filter?: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer[]> {
    return this.offersRepository.find({
      ...options,
      where: filter,
    });
  }

  public createOfferEntity(
    createOfferDto: CreateOfferDto & { user: { id: number } },
    wish: Wish,
  ): Offer {
    return this.offersRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden ?? false,
      item: { id: wish.id },
      user: { id: createOfferDto.user.id },
    });
  }

  public async saveOfferEntity(offer: Offer): Promise<Offer> {
    return this.offersRepository.save(offer);
  }
}
