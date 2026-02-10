import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Offer amount, number with up to 2 decimal places',
    example: 50.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiProperty({
    description:
      'Flag that determines whether the contributor information is hidden',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;

  @ApiProperty({
    description: 'Identifier of the wish item the offer belongs to',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  itemId: number;
}
