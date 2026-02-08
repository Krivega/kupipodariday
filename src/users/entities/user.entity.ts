import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  MaxLength,
  IsUrl,
} from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Offer } from '@/offers/entities/offer.entity';
import { Wish } from '@/wishes/entities/wish.entity';
import { Wishlist } from '@/wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  username!: string; // имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  about!: string; // информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе».

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar!: string; // ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string; // адрес электронной почты пользователя, должен быть уникален

  @Column()
  @IsString()
  @MinLength(6)
  password!: string; // пароль пользователя, строка

  @OneToMany(
    () => {
      return Wish;
    },
    (wish) => {
      return wish.owner;
    },
  )
  wishes: Wish[]; // список желаемых подарков. Используйте для него соответствующий тип связи.

  @OneToMany(
    () => {
      return Offer;
    },
    (offer) => {
      return offer.user;
    },
  )
  offers: Offer[]; // массив ссылок на заявки скинуться от других пользователей.

  @OneToMany(
    () => {
      return Wishlist;
    },
    (wishlist) => {
      return wishlist.owner;
    },
  )
  wishlists: Wishlist[]; // содержит список вишлистов, которые создал пользователь. Установите для него подходящий тип связи.
}
