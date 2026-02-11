import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserPresenter } from '@/users/presenters/user.presenter';

import type { SignupUserResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userPresenter: UserPresenter,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(
    createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.userPresenter.create(createUserDto);
  }

  public auth(user: { id: number; tokenVersion?: number }) {
    const payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion ?? 0,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  public async signout(userId: number): Promise<void> {
    await this.userPresenter.signout(userId);
  }

  public async findOneByCredentials(credentials: {
    username: string;
    password: string;
  }) {
    return this.userPresenter.findOneByCredentials(credentials);
  }

  public async findOneByJwt(jwtPayload: {
    sub: number;
    tokenVersion?: number;
  }) {
    return this.userPresenter.findOneByJwt(jwtPayload);
  }
}
