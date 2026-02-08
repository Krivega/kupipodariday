import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  MaxLength,
} from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

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
  username!: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  about!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column()
  @IsString()
  @MinLength(6)
  password!: string;
}
