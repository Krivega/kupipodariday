import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';

import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(AuthJwtGuard)
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post('find')
  public async find(@Body() findUserDto: FindUserDto) {
    return this.usersService.searchByQuery(findUserDto.query);
  }

  @Get('me')
  public async getMe(@Req() req: Request) {
    const { user } = req;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.findOne({ id: user.id });
  }

  @Patch('me')
  public async updateMe(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { user } = req;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const id = Number(user.id);

    return this.usersService.update({ id }, updateUserDto);
  }

  @Get('me/wishes')
  public async getMeWishes(@Req() req: Request) {
    const { user } = req;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const me = await this.usersService.findOne(
      { id: user.id },
      { relations: ['wishes'] },
    );

    if (!me) {
      throw new NotFoundException('User not found');
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
      throw new NotFoundException('User not found');
    }

    return user.wishes;
  }

  @Get(':username')
  public async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
