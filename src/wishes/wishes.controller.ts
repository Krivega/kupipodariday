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
import {
  wishNotFoundException,
  wishForbiddenException,
  wishChangePriceForbiddenException,
} from './exceptions';
import { WishesService } from './wishes.service';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@UseGuards(AuthJwtGuard)
@Controller('wishes')
export class WishesController {
  public constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  public async getLast(@CurrentUser() user: AuthenticatedUser) {
    const allWishes = await this.wishesService.findMany(
      {},
      {
        relations: ['owner'],
        take: 40,
        order: {
          createdAt: 'DESC',
        },
      },
    );

    return allWishes.map((wish) => {
      return this.wishesService.buildWishViewForUser(wish, user.id);
    });
  }

  @Get('top')
  public async getTop(@CurrentUser() user: AuthenticatedUser) {
    const allWishes = await this.wishesService.findMany(
      {},
      {
        relations: ['owner'],
        take: 20,
        order: {
          copied: 'DESC',
        },
      },
    );

    return allWishes.map((wish) => {
      return this.wishesService.buildWishViewForUser(wish, user.id);
    });
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishesService.findOne(
      { id: Number(id) },
      { relations: ['owner', 'offers', 'offers.user'] },
    );

    if (!wish) {
      throw wishNotFoundException;
    }

    return this.wishesService.buildWishViewForUser(wish, user.id);
  }

  @Patch(':id')
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne(
      { id: Number(id) },
      { relations: ['owner'] },
    );

    if (!wish) {
      throw wishNotFoundException;
    }

    const userId = user.id;

    if (wish.owner.id !== userId) {
      throw wishForbiddenException;
    }

    if (wish.raised > 0) {
      throw wishChangePriceForbiddenException;
    }

    return this.wishesService.update({ id: Number(id) }, updateWishDto);
  }

  @Delete(':id')
  public async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishesService.findOne(
      { id: Number(id) },
      { relations: ['owner'] },
    );

    if (!wish) {
      throw wishNotFoundException;
    }

    const userId = user.id;

    if (wish.owner.id !== userId) {
      throw wishForbiddenException;
    }

    if (wish.raised > 0) {
      throw wishChangePriceForbiddenException;
    }

    return this.wishesService.remove({ id: Number(id) });
  }

  @Post(':id/copy')
  public async copy(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishesService.copy({
      id: Number(id),
      userId: user.id,
    });

    if (!wish) {
      throw wishNotFoundException;
    }

    return this.wishesService.buildWishViewForUser(wish, user.id);
  }

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    const wish = await this.wishesService.create({
      ...createWishDto,
      owner: { id: user.id } as User,
    });

    return this.wishesService.buildWishViewForUser(wish, user.id);
  }
}
