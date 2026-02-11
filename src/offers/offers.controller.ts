import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { offerNotFoundException } from './exceptions';
import { OfferPresenter } from './presenters/offer.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@UseGuards(AuthJwtGuard)
@Controller('offers')
export class OffersController {
  public constructor(private readonly offerPresenter: OfferPresenter) {}

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offerPresenter.create({
      ...createOfferDto,
      user: { id: user.id } as User,
    });
  }

  @Get()
  public async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.offerPresenter.findManyForView(user.id);
  }

  @Get(':id')
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const offer = await this.offerPresenter.findOneForView(Number(id), user.id);

    if (!offer) {
      throw offerNotFoundException;
    }

    return offer;
  }
}
