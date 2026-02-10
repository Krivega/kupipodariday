import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  public constructor(
    @InjectRepository(Offer)
    private readonly usersRepository: Repository<Offer>,
  ) {}

  public async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.usersRepository.create(createOfferDto);

    return this.usersRepository.save(offer);
  }

  public async findOne(
    filter: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer | null> {
    return this.usersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    filter?: FindOptionsWhere<Offer>,
    options?: Omit<FindManyOptions<Offer>, 'where'>,
  ): Promise<Offer[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async remove(filter: FindOptionsWhere<Offer>) {
    return this.usersRepository.delete(filter);
  }
}
