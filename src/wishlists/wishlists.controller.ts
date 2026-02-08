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
  public create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  public findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(Number(id));
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(Number(id), updateWishlistDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.wishlistsService.remove(Number(id));
  }
}
