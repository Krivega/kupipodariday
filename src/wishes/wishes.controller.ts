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

@Controller('wishes')
export class WishesController {
  public constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  public async getLast() {
    return this.wishesService.findMany(
      {},
      {
        relations: ['owner'],
        take: 40,
        order: {
          createdAt: 'DESC',
        },
      },
    );
  }

  @Get('top')
  public async getTop() {
    return this.wishesService.findMany(
      {},
      {
        relations: ['owner'],
        take: 20,
        order: {
          copied: 'DESC',
        },
      },
    );
  }

  @UseGuards(AuthJwtGuard)
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

  @UseGuards(AuthJwtGuard)
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

  @UseGuards(AuthJwtGuard)
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

  @UseGuards(AuthJwtGuard)
  @Post(':id/copy')
  public async copy(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const wish = await this.wishesService.findOne({ id: Number(id) });

    if (!wish) {
      throw wishNotFoundException;
    }

    return this.wishesService.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: user.id } as User,
    });
  }

  @UseGuards(AuthJwtGuard)
  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create({
      ...createWishDto,
      owner: { id: user.id } as User,
    });
  }
}
