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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { wishlistNotFoundException } from './exceptions';
import { WishlistPresenter } from './presenters/wishlist.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@UseGuards(AuthJwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  public constructor(private readonly wishlistPresenter: WishlistPresenter) {}

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistPresenter.create({
      ...createWishlistDto,
      owner: { id: user.id } as User,
    });
  }

  @Get()
  public async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistPresenter.findManyForView(user.id);
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wishlist = await this.wishlistPresenter.findOneForView(
      Number(id),
      user.id,
    );

    if (wishlist === undefined) {
      throw wishlistNotFoundException;
    }

    return wishlist;
  }

  @Patch(':id')
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    await this.wishlistPresenter.update(Number(id), user.id, updateWishlistDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.wishlistPresenter.remove(Number(id), user.id);
  }
}
