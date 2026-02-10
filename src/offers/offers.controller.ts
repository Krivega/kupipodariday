import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { offerNotFoundException } from './exceptions';
import { OffersService } from './offers.service';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@UseGuards(AuthJwtGuard)
@Controller('offers')
export class OffersController {
  public constructor(private readonly offersService: OffersService) {}

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offersService.create({
      ...createOfferDto,
      user: { id: user.id } as User,
    });
  }

  @Get()
  public async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.offersService.findManyForUser(user.id);
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const offer = await this.offersService.findOneForUser(Number(id), user.id);

    if (!offer) {
      throw offerNotFoundException;
    }

    return offer;
  }
}
