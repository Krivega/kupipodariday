import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { userNotFoundException } from './exceptions';
import { hashPassword, comparePassword } from './hashPassword';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ——— Pure CRUD ———

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

  // ——— Business logic & data processing ———

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.createUserEntity({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.saveUserEntity(user);
  }

  public async update(
    filter: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const data =
      updateUserDto.password === undefined
        ? updateUserDto
        : {
            ...updateUserDto,
            password: await hashPassword(updateUserDto.password),
          };

    await this.updateUserEntity(filter, data);

    const user = await this.findOneUserEntity(filter);

    if (!user) {
      throw userNotFoundException;
    }

    return user;
  }

  public async findOneByCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.findOneUserEntity({ username });

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    return isPasswordValid ? user : undefined;
  }

  public async searchByQuery(query: string): Promise<User[]> {
    if (!query) {
      return this.findManyUserEntity();
    }

    const likeQuery = `%${query}%`;

    return this.findManyUserEntity([
      { username: ILike(likeQuery) },
      { email: ILike(likeQuery) },
      { about: ILike(likeQuery) },
    ]);
  }
}
