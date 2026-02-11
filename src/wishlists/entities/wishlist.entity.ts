import { IsOptional, IsString, MinLength, MaxLength, IsUrl } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Wish } from '@/wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name!: string; // название списка. Не может быть длиннее 250 символов и короче одного.

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(1500)
  description?: string; // описание подборки, строка от 1 до 1500 символов; пустая строка не допускается

  @Column()
  @IsUrl()
  image!: string; // обложка для подборки, строка. Должна быть валидным URL.

  @ManyToOne(() => {
    return User;
  })
  @JoinColumn()
  owner: User; // ссылка на пользователя, который создал подборку.

  @OneToMany(
    () => {
      return Wish;
    },
    (wish) => {
      return wish.wishlist;
    },
  )
  items: Wish[]; // набор ссылок на подарки
}
