import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
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
    return this.offersService.findMany({});
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.offersService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update({ id: Number(id) }, updateOfferDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.offersService.remove({ id: Number(id) });
  }
}
