import { IsBoolean, IsNumber, Min } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { Wish } from '@/wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount!: number; // сумма заявки, округляется до двух знаков после запятой;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  hidden = false; // флаг, который определяет показывать ли информацию о скидывающемся пользователе в списке. По умолчанию равен false.

  @ManyToOne(
    () => {
      return User;
    },
    (user) => {
      return user.offers;
    },
  )
  user: User; // содержит id желающего скинуться;

  @ManyToOne(
    () => {
      return Wish;
    },
    (wish) => {
      return wish.offers;
    },
  )
  item: Wish; // содержит ссылку на товар;
}
