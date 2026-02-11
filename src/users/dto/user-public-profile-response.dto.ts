import { ApiProperty } from '@nestjs/swagger';

export class UserPublicProfileResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ example: 'johndoe', minLength: 2, maxLength: 30 })
  username!: string;

  @ApiProperty({
    example: 'Пока ничего не рассказал о себе',
    minLength: 2,
    maxLength: 200,
  })
  about!: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  avatar!: string;
}
