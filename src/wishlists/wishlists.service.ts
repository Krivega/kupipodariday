import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

import type { User } from '@/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  public constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
  ) {}

  public async create(
    createWishlistDto: CreateWishlistDto & { owner: User },
  ): Promise<Wishlist> {
    const wishlist = this.wishListRepository.create(createWishlistDto);

    return this.wishListRepository.save(wishlist);
  }

  public async findOne(
    filter: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist | null> {
    return this.wishListRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    filter?: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist[]> {
    return this.wishListRepository.find({
      ...options,
      where: filter,
    });
  }

  public async update(
    filter: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishListRepository.update(filter, updateWishlistDto);
  }

  public async remove(filter: FindOptionsWhere<Wishlist>) {
    return this.wishListRepository.delete(filter);
  }
}
