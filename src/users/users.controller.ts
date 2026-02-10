import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get('find')
  public async find(@Query('query') query: string) {
    return this.usersService.searchByQuery(query);
  }

  @Get(':username')
  public async findOne(@Param('username') username: string) {
    return this.usersService.findOne({ username });
  }

  @UseGuards(AuthJwtGuard)
  @Get('me')
  public async getMe(@Req() req: Request) {
    const { user } = req;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.findOne({ id: user.id });
  }

  @UseGuards(AuthJwtGuard)
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

    if (!Number.isFinite(id)) {
      throw new ForbiddenException('Invalid user identifier');
    }

    return this.usersService.update({ id }, updateUserDto);
  }
}
