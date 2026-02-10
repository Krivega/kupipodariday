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
import {
  toUserProfileResponseDto,
  UserProfileResponseDto,
} from './dto/user-profile-response.dto';
import {
  toUserPublicProfileResponseDto,
  UserPublicProfileResponseDto,
} from './dto/user-public-profile-response.dto';
import { toUserWishesDto, UserWishesDto } from './dto/user-wishes.dto';
import { userNotFoundException } from './exceptions';
import { UsersService } from './users.service';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@UseGuards(AuthJwtGuard)
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post('find')
  public async findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponseDto[]> {
    const users = await this.usersService.searchByQuery(findUsersDto.query);

    return users.map(toUserProfileResponseDto);
  }

  @Get('me')
  public async findOwn(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileResponseDto> {
    const me = await this.usersService.findOne({ id: user.id });

    if (!me) {
      throw userNotFoundException;
    }

    return toUserProfileResponseDto(me);
  }

  @Patch('me')
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const id = Number(user.id);
    const updated = await this.usersService.update({ id }, updateUserDto);

    return toUserProfileResponseDto(updated);
  }

  @Get('me/wishes')
  public async getOwnWishes(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWishesDto[]> {
    const me = await this.usersService.findOne(
      { id: user.id },
      { relations: ['wishes'] },
    );

    if (!me) {
      throw userNotFoundException;
    }

    return me.wishes.map(toUserWishesDto);
  }

  @Get(':username/wishes')
  public async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne(
      { username },
      { relations: ['wishes'] },
    );

    if (!user) {
      throw userNotFoundException;
    }

    return user.wishes.map(toUserWishesDto);
  }

  @Get(':username')
  public async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw userNotFoundException;
    }

    return toUserPublicProfileResponseDto(user);
  }
}
