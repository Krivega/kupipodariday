import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
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

  @ApiProperty({ example: 'test@example.com' })
  email!: string;
}

export function toUserProfileResponseDto(user: {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  about: string;
  avatar: string;
  email: string;
}): UserProfileResponseDto {
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    username: user.username,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
  };
}
