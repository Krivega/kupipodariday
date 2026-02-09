import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  public constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  public async create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  public async findAll() {
    return this.wishlistsService.findMany({});
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update({ id: Number(id) }, updateWishlistDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.wishlistsService.remove({ id: Number(id) });
  }
}
