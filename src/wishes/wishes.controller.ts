import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  public constructor(private readonly wishesService: WishesService) {}

  @Post()
  public create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }

  @Get()
  public findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.wishesService.findOne(Number(id));
  }

  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(Number(id), updateWishDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.wishesService.remove(Number(id));
  }
}
