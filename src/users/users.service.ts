import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword, comparePassword } from './hashPassword';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  public async update(
    filter: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ) {
    let data = updateUserDto;

    if (updateUserDto.password !== undefined) {
      const hashedPassword = await hashPassword(updateUserDto.password);

      data = { ...updateUserDto, password: hashedPassword };
    }

    return this.usersRepository.update(filter, data);
  }

  public async findOneByCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.findOne({ username });

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    return isPasswordValid ? user : undefined;
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
    filter: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    options?: Omit<FindManyOptions<User>, 'where'>,
  ): Promise<User[]> {
    return this.usersRepository.find({
      ...options,
      where: filter,
    });
  }

  public async searchByQuery(query: string): Promise<User[]> {
    if (!query) {
      return this.findMany({});
    }

    const likeQuery = `%${query}%`;

    return this.findMany([
      { username: ILike(likeQuery) },
      { email: ILike(likeQuery) },
      { about: ILike(likeQuery) },
    ]);
  }

  /** Увеличивает tokenVersion пользователя — инвалидирует все выданные ему JWT */
  public async incrementTokenVersion(userId: number): Promise<void> {
    await this.usersRepository.increment({ id: userId }, 'tokenVersion', 1);
  }
}
