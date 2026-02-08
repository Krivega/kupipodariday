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
  public create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  public findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    return this.offersService.update(Number(id), updateOfferDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.offersService.remove(Number(id));
  }
}
