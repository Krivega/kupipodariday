import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferIdParameterDto } from './dto/offer-id-parameter.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { offerNotFoundException } from './exceptions';
import { OfferPresenter } from './presenters/offer.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@ApiTags('offers')
@UseGuards(AuthJwtGuard)
@Controller('offers')
export class OffersController {
  public constructor(private readonly offerPresenter: OfferPresenter) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create offer' })
  @ApiResponse({ status: 201, description: 'Created offer', type: Object })
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<OfferResponseDto> {
    return this.offerPresenter.create({
      ...createOfferDto,
      user: { id: user.id } as User,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({
    status: 200,
    description: 'List of offers',
    type: [OfferResponseDto],
  })
  public async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OfferResponseDto[]> {
    return this.offerPresenter.findManyForView(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by id' })
  @ApiResponse({ status: 200, description: 'Offer', type: OfferResponseDto })
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: OfferIdParameterDto,
  ): Promise<OfferResponseDto> {
    const offerId = Number.parseInt(params.id, 10);

    const offer = await this.offerPresenter.findOneForView(offerId, user.id);

    if (offer === undefined) {
      throw offerNotFoundException;
    }

    return offer;
  }
}
