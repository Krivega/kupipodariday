import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  public constructor(
    @InjectRepository(Wishlist)
    private readonly usersRepository: Repository<Wishlist>,
  ) {}

  public async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = this.usersRepository.create(createWishlistDto);

    return this.usersRepository.save(wishlist);
  }

  public async findOne(
    filter: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist | null> {
    return this.usersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findMany(
    filter: FindOptionsWhere<Wishlist>,
    options?: Omit<FindManyOptions<Wishlist>, 'where'>,
  ): Promise<Wishlist[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async update(
    filter: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.usersRepository.update(filter, updateWishlistDto);
  }

  public async remove(filter: FindOptionsWhere<Wishlist>) {
    return this.usersRepository.delete(filter);
  }
}
