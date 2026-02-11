/* eslint-disable @typescript-eslint/class-methods-use-this */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';

import { OffersPresenter } from '@/offers/offers.presenter';
import { WishResponseDto } from '@/wishes/dto/wish-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import {
  userNotFoundException,
  userAlreadyExistsException,
} from './exceptions';
import { hashPassword, comparePassword } from './hashPassword';
import { UsersService } from './users.service';

import type { Wish } from '@/wishes/entities/wish.entity';
import type { User } from './entities/user.entity';

const USER_WISHES_RELATIONS = [
  'wishes',
  'wishes.offers',
  'wishes.offers.user',
] as const;

const USER_OWN_WISHES_RELATIONS = [
  'wishes',
  'wishes.owner',
  'wishes.offers',
  'wishes.offers.user',
] as const;

@Injectable()
export class UsersPresenter {
  public constructor(
    private readonly usersService: UsersService,
    @Inject(
      forwardRef(() => {
        return OffersPresenter;
      }),
    )
    private readonly offerPresenter: OffersPresenter,
  ) {}

  public toProfile(user: User): UserProfileResponseDto {
    return {
      ...this.toPublicProfile(user),
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

  public buildWishResponse(wish: Wish, currentUserId: number): WishResponseDto {
    const raised = this.offerPresenter.calculateRaised(
      wish.offers,
      currentUserId,
    );

    return {
      id: wish.id,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      raised,
      copied: wish.copied,
      description: wish.description,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      owner: this.toPublicProfile(wish.owner),
      offers: this.offerPresenter.buildOffersView(wish.offers, currentUserId),
    };
  }

  public toWishes(wishes: Wish[], currentUserId: number): UserWishesDto[] {
    return wishes.map((wish) => {
      const raised = this.offerPresenter.calculateRaised(
        wish.offers,
        currentUserId,
      );

      return {
        id: wish.id,
        createdAt: wish.createdAt,
        updatedAt: wish.updatedAt,
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: Number(wish.price),
        raised,
        copied: wish.copied,
        description: wish.description,
        offers: this.offerPresenter.buildOffersView(wish.offers, currentUserId),
      };
    });
  }

  public async findOnePublicProfile(
    filter: FindOptionsWhere<User>,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findOneUserEntity(filter);

    if (!user) {
      throw userNotFoundException;
    }

    return this.toPublicProfile(user);
  }

  public async findOneProfile(
    filter: FindOptionsWhere<User>,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOneUserEntity(filter);

    if (!user) {
      throw userNotFoundException;
    }

    return this.toProfile(user);
  }

  public async findOwnWishes(userId: number): Promise<WishResponseDto[]> {
    const user = await this.usersService.findOneUserEntity(
      { id: userId },
      { relations: [...USER_OWN_WISHES_RELATIONS] },
    );

    if (!user) {
      throw userNotFoundException;
    }

    return user.wishes.map((wish) => {
      return this.buildWishResponse(wish, userId);
    });
  }

  public async findOneWithWishes(
    filter: FindOptionsWhere<User>,
    currentUserId: number,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOneUserEntity(filter, {
      relations: [...USER_WISHES_RELATIONS],
    });

    if (!user) {
      throw userNotFoundException;
    }

    return this.toWishes(user.wishes, currentUserId);
  }

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<UserProfileResponseDto> {
    const isUserExistsByUsernameOrEmail =
      await this.usersService.hasExistsUserEntity([
        { username: createUserDto.username },
        { email: createUserDto.email },
      ]);

    if (isUserExistsByUsernameOrEmail) {
      throw userAlreadyExistsException;
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.usersService.createUserEntity({
      ...createUserDto,
      password: hashedPassword,
    });

    const userSaved = await this.usersService.saveUserEntity(user);

    return this.toProfile(userSaved);
  }

  public async update(
    filter: FindOptionsWhere<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
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

    return this.toProfile(user);
  }

  public async findOneByCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<UserProfileResponseDto | undefined> {
    const user = await this.usersService.findOneUserEntity({ username });

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    return isPasswordValid ? this.toProfile(user) : undefined;
  }

  public async findOneByJwt(jwtPayload: {
    sub: number;
    tokenVersion?: number;
  }): Promise<UserProfileResponseDto | undefined> {
    const user = await this.usersService.findOneUserEntity({
      id: jwtPayload.sub,
    });

    if (!user) {
      return undefined;
    }

    const tokenVersion = jwtPayload.tokenVersion ?? 0;

    if (user.tokenVersion !== tokenVersion) {
      return undefined;
    }

    return this.toProfile(user);
  }

  public async searchByQuery(query: string): Promise<UserProfileResponseDto[]> {
    if (!query) {
      return this.usersService.findManyUserEntity();
    }

    const likeQuery = `%${query}%`;

    const users = await this.usersService.findManyUserEntity([
      { username: ILike(likeQuery) },
      { email: ILike(likeQuery) },
      { about: ILike(likeQuery) },
    ] as FindOptionsWhere<User>[]);

    return users.map((user) => {
      return this.toProfile(user);
    });
  }

  /** Инвалидирует все JWT пользователя: увеличивает tokenVersion в БД на 1 */
  public async signout(userId: number): Promise<void> {
    return this.usersService.incrementTokenVersionUserEntity(userId);
  }
}
