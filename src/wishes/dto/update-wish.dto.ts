import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Все поля опциональны. Спецификация требует пустой объект свойств.
 */
export class UpdateWishDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  link?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  description?: string;
}
