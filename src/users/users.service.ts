import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  public async findOne(
    filter: FindOptionsWhere<User>,
    options?: Omit<FindManyOptions<User>, 'where'>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async hasExists(
    filter: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<boolean> {
    return this.usersRepository.exists({ where: filter });
  }

  public async findMany(
    filter: FindOptionsWhere<User>,
    options?: Omit<FindManyOptions<User>, 'where'>,
  ): Promise<User[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async update(
    filter: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersRepository.update(filter, updateUserDto);
  }

  public async remove(filter: FindOptionsWhere<User>) {
    return this.usersRepository.delete(filter);
  }
}
