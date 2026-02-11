import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class WishIdParameterDto {
  @ApiProperty({ description: 'Wish ID', example: 1 })
  @Type(() => {
    return Number;
  })
  @IsInt()
  @IsPositive()
  id!: number;
}
