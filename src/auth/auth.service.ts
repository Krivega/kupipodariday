import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.auth(user);
  }

  public auth(user: { id: number; tokenVersion?: number }) {
    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion ?? 0,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  /** Инвалидирует все JWT пользователя: увеличивает tokenVersion в БД */
  public async signout(userId: number): Promise<void> {
    await this.usersService.incrementTokenVersion(userId);
  }

  public async validatePassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      return undefined;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    return undefined;
  }
}
