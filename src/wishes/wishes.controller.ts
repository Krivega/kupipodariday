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
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishIdParameterDto } from './dto/wish-id-parameter.dto';
import { WishResponseDto } from './dto/wish-response.dto';
import { wishNotFoundException } from './exceptions';
import { WishPresenter } from './presenters/wish.presenter';

import type { AuthenticatedUser } from '@/auth/decorators/currentUser.decorator';

@ApiTags('wishes')
@UseGuards(AuthJwtGuard)
@Controller('wishes')
export class WishesController {
  public constructor(private readonly wishPresenter: WishPresenter) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create wish' })
  @ApiResponse({ status: 201, description: 'Created wish', type: Object })
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createWishDto: CreateWishDto,
  ): Promise<WishResponseDto> {
    return this.wishPresenter.create({
      ...createWishDto,
      owner: { id: user.id },
    });
  }

  @Get('last')
  @ApiOperation({ summary: 'Get last wishes' })
  @ApiResponse({
    status: 200,
    description: 'List of last wishes',
    type: [WishResponseDto],
  })
  public async findLast(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WishResponseDto[]> {
    return this.wishPresenter.findManyLast(user.id);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top wishes' })
  @ApiResponse({
    status: 200,
    description: 'List of top wishes',
    type: [WishResponseDto],
  })
  public async findTop(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WishResponseDto[]> {
    return this.wishPresenter.findManyTop(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wish by id' })
  @ApiResponse({ status: 200, description: 'Wish', type: WishResponseDto })
  public async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishIdParameterDto,
  ): Promise<WishResponseDto> {
    const wish = await this.wishPresenter.findOneForView(params.id, user.id);

    if (wish === undefined) {
      throw wishNotFoundException;
    }

    return wish;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update wish' })
  @ApiResponse({ status: 200, description: 'Wish updated' })
  public async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishIdParameterDto,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<void> {
    await this.wishPresenter.update(params.id, user.id, updateWishDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove wish' })
  @ApiResponse({
    status: 200,
    description: 'Deleted wish',
    type: WishResponseDto,
  })
  public async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishIdParameterDto,
  ): Promise<WishResponseDto> {
    return this.wishPresenter.remove(params.id, user.id);
  }

  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Copy wish' })
  @ApiResponse({ status: 201, description: 'Copied wish', type: Object })
  public async copy(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: WishIdParameterDto,
  ): Promise<WishResponseDto> {
    const wish = await this.wishPresenter.copy({
      id: params.id,
      userId: user.id,
    });

    if (wish === undefined) {
      throw wishNotFoundException;
    }

    return wish;
  }
}
