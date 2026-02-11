import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserPresenter } from '@/users/presenters/user.presenter';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly userPresenter: UserPresenter,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
    const user = await this.userPresenter.create(createUserDto);

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
    await this.usersService.incrementTokenVersionUserEntity(userId);
  }

  public async findOneByCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    return this.userPresenter.findOneByCredentials({
      username,
      password,
    });
  }
}
