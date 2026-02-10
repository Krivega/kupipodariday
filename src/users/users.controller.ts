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
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userNotFoundException } from './exceptions';
import { UsersService } from './users.service';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@UseGuards(AuthJwtGuard)
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post('find')
  public async find(@Body() findUserDto: FindUserDto) {
    return this.usersService.searchByQuery(findUserDto.query);
  }

  @Get('me')
  public async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findOne({ id: user.id });
  }

  @Patch('me')
  public async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const id = Number(user.id);

    return this.usersService.update({ id }, updateUserDto);
  }

  @Get('me/wishes')
  public async getMeWishes(@CurrentUser() user: AuthenticatedUser) {
    const me = await this.usersService.findOne(
      { id: user.id },
      { relations: ['wishes'] },
    );

    if (!me) {
      throw userNotFoundException;
    }

    return me.wishes;
  }

  @Get(':username/wishes')
  public async getWishes(@Param('username') username: string) {
    const user = await this.usersService.findOne(
      { username },
      { relations: ['wishes'] },
    );

    if (!user) {
      throw userNotFoundException;
    }

    return user.wishes;
  }

  @Get(':username')
  public async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw userNotFoundException;
    }

    return user;
  }
}
