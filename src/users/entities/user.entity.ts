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
  username!: string; // имя пользователя, уникальная строка от 2 до 30 символов, обязательное поле

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  about!: string; // информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе».

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string; // email, уникальная строка, обязательное поле

  @Column()
  @IsString()
  @MinLength(6)
  password!: string; // password, строка от 6 до 32 символов, обязательное поле
}
