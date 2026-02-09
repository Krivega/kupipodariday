import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  public constructor(
    @InjectRepository(Wish)
    private readonly usersRepository: Repository<Wish>,
  ) {}

  public async create(createWishDto: CreateWishDto): Promise<Wish> {
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
}
