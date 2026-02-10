import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  public constructor(private readonly offersService: OffersService) {}

  @Post()
  public async create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  public async findAll() {
    return this.offersService.findMany();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.offersService.findOne({ id: Number(id) });
  }
}
