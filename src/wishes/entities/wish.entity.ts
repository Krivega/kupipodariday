import {
  IsInt,
  IsString,
  IsUrl,
  Min,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name!: string; // название подарка. Не может быть длиннее 250 символов и короче одного.

  @Column()
  @IsUrl()
  link!: string; // ссылка на интернет-магазин, в котором можно приобрести подарок, строка.

  @Column()
  @IsUrl()
  image!: string; // ссылка на изображение подарка, строка. Должна быть валидным URL.

  @Column('decimal', { precision: 10, scale: 2 })
  @IsInt()
  @Min(1)
  price!: number; // стоимость подарка, с округлением до сотых, число.

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsInt()
  @Min(0)
  raised = 0; // сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых.

  @Column('integer', { default: 0 })
  @IsInt()
  @Min(0)
  copied = 0; // содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число.

  @Column()
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description!: string; // строка с описанием подарка длиной от 1 и до 1024 символов

  @ManyToOne(
    () => {
      return User;
    },
    (user) => {
      return user.wishes;
    },
  )
  @JoinColumn({ name: 'owner_id' })
  owner: User; // ссылка на пользователя, который добавил пожелание подарка.
}
