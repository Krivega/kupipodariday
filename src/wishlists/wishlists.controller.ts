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
import {
  wishlistNotFoundException,
  wishlistForbiddenException,
} from './exceptions';
import { WishlistsService } from './wishlists.service';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@UseGuards(AuthJwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  public constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create({
      ...createWishlistDto,
      owner: { id: user.id } as User,
    });
  }

  @Get()
  public async findAll() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne({ id: Number(id) });

    if (!wishlist) {
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
    const wishlist = await this.wishlistsService.findOne(
      { id: Number(id) },
      { relations: ['owner'] },
    );

    if (!wishlist) {
      throw wishlistNotFoundException;
    }

    const userId = user.id;

    if (wishlist.owner.id !== userId) {
      throw wishlistForbiddenException;
    }

    return this.wishlistsService.update({ id: Number(id) }, updateWishlistDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wishlist = await this.wishlistsService.findOne(
      { id: Number(id) },
      { relations: ['owner'] },
    );

    if (!wishlist) {
      throw wishlistNotFoundException;
    }

    const userId = user.id;

    if (wishlist.owner.id !== userId) {
      throw wishlistForbiddenException;
    }

    return this.wishlistsService.remove({ id: Number(id) });
  }
}
