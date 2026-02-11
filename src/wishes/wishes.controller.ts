import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { wishNotFoundException } from './exceptions';
import { WishPresenter } from './presenters/wish.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@UseGuards(AuthJwtGuard)
@Controller('wishes')
export class WishesController {
  public constructor(private readonly wishPresenter: WishPresenter) {}

  @Get('last')
  public async getLast(@CurrentUser() user: AuthenticatedUser) {
    return this.wishPresenter.findManyLast(user.id);
  }

  @Get('top')
  public async getTop(@CurrentUser() user: AuthenticatedUser) {
    return this.wishPresenter.findManyTop(user.id);
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishPresenter.findOneForView(Number(id), user.id);

    if (!wish) {
      throw wishNotFoundException;
    }

    return wish;
  }

  @Patch(':id')
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    await this.wishPresenter.update(Number(id), user.id, updateWishDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.wishPresenter.remove(Number(id), user.id);
  }

  @Post(':id/copy')
  public async copy(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishPresenter.copy({
      id: Number(id),
      userId: user.id,
    });

    if (!wish) {
      throw wishNotFoundException;
    }

    return wish;
  }

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishPresenter.create({
      ...createWishDto,
      owner: { id: user.id },
    });
  }
}
