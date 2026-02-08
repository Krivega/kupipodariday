import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

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
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(250)
  name!: string; // название списка. Не может быть длиннее 250 символов и короче одного.
}
