import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OfferIdParameterDto {
  @ApiProperty({ description: 'Offer ID', example: '1' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}
