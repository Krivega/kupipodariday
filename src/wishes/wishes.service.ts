import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  EntityManager,
} from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

import type { UserIdRef } from '@/users/types/user-id-ref.type';

@Injectable()
export class WishesService {
  public constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  public createWishEntity(
    createWishDto: CreateWishDto & { owner: UserIdRef },
  ): Wish {
    return this.wishRepository.create(createWishDto);
  }

  public async findOneWishEntity(
    filter: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish | null> {
    return this.wishRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findManyWishEntity(
    filter?: FindOptionsWhere<Wish>,
    options?: Omit<FindManyOptions<Wish>, 'where'>,
  ): Promise<Wish[]> {
    return this.wishRepository.find({
      ...options,
      where: filter,
    });
  }

  public async saveWishEntity(wish: Wish): Promise<Wish> {
    return this.wishRepository.save(wish);
  }

  public async updateWishEntity(
    filter: FindOptionsWhere<Wish>,
    updateWishDto: UpdateWishDto & { copied?: number },
  ) {
    return this.wishRepository.update(filter, updateWishDto);
  }

  public async removeWishEntity(filter: FindOptionsWhere<Wish>) {
    return this.wishRepository.delete(filter);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public async incrementWishRaised(
    wishId: number,
    amount: number,
    manager: EntityManager,
  ): Promise<void> {
    const roundedAmount = Math.round(amount * 100) / 100;
    const repository = manager.getRepository(Wish);

    await repository.increment({ id: wishId }, 'raised', roundedAmount);
  }

  public async createWish(
    createWishDto: CreateWishDto & { owner: UserIdRef },
  ): Promise<Wish> {
    const wish = this.createWishEntity(createWishDto);

    return this.saveWishEntity(wish);
  }
}
