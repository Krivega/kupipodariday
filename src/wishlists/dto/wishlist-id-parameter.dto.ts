import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class WishlistIdParameterDto {
  @ApiProperty({ description: 'Wishlist ID', example: 1 })
  @Type(() => {
    return Number;
  })
  @IsInt()
  @IsPositive()
  id!: number;
}
