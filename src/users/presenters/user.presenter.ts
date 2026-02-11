/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserProfileResponseDto } from '../dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from '../dto/user-public-profile-response.dto';
import { UserWishesDto } from '../dto/user-wishes.dto';
import { userNotFoundException } from '../exceptions';
import { hashPassword, comparePassword } from '../hashPassword';
import { UsersService } from '../users.service';

import type { Wish } from '@/wishes/entities/wish.entity';
import type { User } from '../entities/user.entity';

@Injectable()
export class UserPresenter {
  public constructor(private readonly usersService: UsersService) {}

  public toProfile(user: User): UserProfileResponseDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };
  }

  public toPublicProfile(user: User): UserPublicProfileResponseDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }

  public toWishes(wishes: Wish[]): UserWishesDto[] {
    return wishes.map((wish) => {
      return {
        id: wish.id,
        createdAt: wish.createdAt,
        updatedAt: wish.updatedAt,
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: Number(wish.price),
        raised: Number(wish.raised),
        copied: wish.copied,
        description: wish.description,
      };
    });
  }

  public async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersService.findOneUserEntity(filter);
  }

  public async findOneWithWishes(
    filter: FindOptionsWhere<User>,
  ): Promise<User | null> {
    return this.usersService.findOneUserEntity(filter, {
      relations: ['wishes'],
    });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.usersService.createUserEntity({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersService.saveUserEntity(user);
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

    await this.usersService.updateUserEntity(filter, data);

    const user = await this.usersService.findOneUserEntity(filter);

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
    const user = await this.usersService.findOneUserEntity({ username });

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    return isPasswordValid ? user : undefined;
  }

  public async searchByQuery(query: string): Promise<User[]> {
    if (!query) {
      return this.usersService.findManyUserEntity();
    }

    const likeQuery = `%${query}%`;

    return this.usersService.findManyUserEntity([
      { username: ILike(likeQuery) },
      { email: ILike(likeQuery) },
      { about: ILike(likeQuery) },
    ] as FindOptionsWhere<User>[]);
  }
}
