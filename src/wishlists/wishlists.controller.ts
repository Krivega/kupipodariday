import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/auth/decorators/currentUser.decorator';
import { AuthJwtGuard } from '@/auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistIdParameterDto } from './dto/wishlist-id-parameter.dto';
import { WishlistResponseDto } from './dto/wishlist-response.dto';
import { wishlistNotFoundException } from './exceptions';
import { WishlistsPresenter } from './wishlists.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';
import type { User } from '@/users/entities/user.entity';

@ApiTags('wishlistlists')
@UseGuards(AuthJwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  public constructor(private readonly wishlistPresenter: WishlistsPresenter) {}

  @Get()
  @ApiOperation({ summary: 'Get all wishlists' })
  @ApiResponse({
    status: 200,
    description: 'List of wishlists',
    type: [WishlistResponseDto],
  })
  public async findAll(): Promise<WishlistResponseDto[]> {
    return this.wishlistPresenter.findManyForView();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Created wishlist',
    type: WishlistResponseDto,
  })
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistResponseDto> {
    return this.wishlistPresenter.create({
      ...createWishlistDto,
      owner: { id: user.id } as User,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wishlist by id' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist',
    type: WishlistResponseDto,
  })
  public async findOne(
    @Param() params: WishlistIdParameterDto,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistPresenter.findOneForView(params.id);

    if (wishlist === undefined) {
      throw wishlistNotFoundException;
    }

    return wishlist;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Updated wishlist',
    type: WishlistResponseDto,
  })
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishlistIdParameterDto,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistResponseDto> {
    return this.wishlistPresenter.update(params.id, user.id, updateWishlistDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove wishlist',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted wishlist',
    type: WishlistResponseDto,
  })
  public async removeOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishlistIdParameterDto,
  ): Promise<WishlistResponseDto> {
    return this.wishlistPresenter.remove(params.id, user.id);
  }
}
