import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public createUserEntity(
    userData: CreateUserDto & { password: string },
  ): User {
    return this.usersRepository.create(userData);
  }

  public async findOneUserEntity(
    filter: FindOptionsWhere<User>,
    options?: Omit<FindManyOptions<User>, 'where'>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      ...options,
      where: filter,
    });
  }

  public async findManyUserEntity(
    filter?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    options?: Omit<FindManyOptions<User>, 'where'>,
  ): Promise<User[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async saveUserEntity(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  public async updateUserEntity(
    filter: FindOptionsWhere<User>,
    data: Partial<User>,
  ) {
    return this.usersRepository.update(filter, data);
  }

  public async hasExistsUserEntity(
    filter: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<boolean> {
    return this.usersRepository.exists({ where: filter });
  }

  /** Увеличивает tokenVersion пользователя — инвалидирует все выданные ему JWT */
  public async incrementTokenVersionUserEntity(userId: number): Promise<void> {
    await this.usersRepository.increment({ id: userId }, 'tokenVersion', 1);
  }
}
