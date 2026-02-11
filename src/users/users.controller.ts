import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { userNotFoundException } from './exceptions';
import { UserPresenter } from './presenters/user.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@UseGuards(AuthJwtGuard)
@Controller('users')
export class UsersController {
  public constructor(private readonly userPresenter: UserPresenter) {}

  @Post('find')
  public async findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponseDto[]> {
    const users = await this.userPresenter.searchByQuery(findUsersDto.query);

    return users.map((u) => {
      return this.userPresenter.toProfile(u);
    });
  }

  @Get('me')
  public async findOwn(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileResponseDto> {
    const own = await this.userPresenter.findOne({ id: user.id });

    if (!own) {
      throw userNotFoundException;
    }

    return this.userPresenter.toProfile(own);
  }

  @Patch('me')
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const id = Number(user.id);
    const updated = await this.userPresenter.update({ id }, updateUserDto);

    return this.userPresenter.toProfile(updated);
  }

  @Get('me/wishes')
  public async getOwnWishes(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWishesDto[]> {
    const own = await this.userPresenter.findOneWithWishes({ id: user.id });

    if (!own) {
      throw userNotFoundException;
    }

    return this.userPresenter.toWishes(own.wishes);
  }

  @Get(':username/wishes')
  public async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.userPresenter.findOneWithWishes({ username });

    if (!user) {
      throw userNotFoundException;
    }

    return this.userPresenter.toWishes(user.wishes);
  }

  @Get(':username')
  public async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.userPresenter.findOne({ username });

    if (!user) {
      throw userNotFoundException;
    }

    return this.userPresenter.toPublicProfile(user);
  }
}
