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
  public async create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }

  @Get()
  public async findAll() {
    return this.wishesService.findMany({});
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.wishesService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update({ id: Number(id) }, updateWishDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.wishesService.remove({ id: Number(id) });
  }
}
