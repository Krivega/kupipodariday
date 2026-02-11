import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { WishResponseDto } from '@/wishes/dto/wish-response.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { UsernameParameterDto } from './dto/username-parameter.dto';
import { UsersPresenter } from './users.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@ApiTags('users')
@UseGuards(AuthJwtGuard)
@Controller('users')
export class UsersController {
  public constructor(private readonly userPresenter: UsersPresenter) {}

  @Post('find')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Search users by query' })
  @ApiResponse({
    status: 201,
    description: 'List of found users',
    type: [UserPublicProfileResponseDto],
  })
  public async findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    return this.userPresenter.searchByQuery(findUsersDto.query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserProfileResponseDto,
  })
  public async findOwn(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileResponseDto> {
    return this.userPresenter.findOneProfile({ id: user.id });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Updated user profile',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации переданных значений',
  })
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const id = Number(user.id);

    return this.userPresenter.update({ id }, updateUserDto);
  }

  @Get('me/wishes')
  @ApiOperation({ summary: 'Get current user wishes' })
  @ApiResponse({
    status: 200,
    description: 'List of current user wishes',
    type: [WishResponseDto],
  })
  public async getOwnWishes(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WishResponseDto[]> {
    return this.userPresenter.findOwnWishes(user.id);
  }

  @Get(':username/wishes')
  @ApiOperation({ summary: 'Get wishes by username' })
  @ApiResponse({
    status: 200,
    description: 'List of user wishes',
    type: [UserWishesDto],
  })
  public async getWishes(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: UsernameParameterDto,
  ): Promise<UserWishesDto[]> {
    return this.userPresenter.findOneWithWishes(
      { username: params.username },
      user.id,
    );
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get public profile by username' })
  @ApiResponse({
    status: 200,
    description: 'User public profile',
    type: UserPublicProfileResponseDto,
  })
  public async findOne(
    @Param() params: UsernameParameterDto,
  ): Promise<UserPublicProfileResponseDto> {
    return this.userPresenter.findOnePublicProfile({
      username: params.username,
    });
  }
}
