import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { userAlreadyExistsException } from '@/users/exceptions';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { AuthLocalGuard } from './guards/auth.guard';
import { AuthJwtGuard } from './guards/jwt.guard';

import type { AuthenticatedUser } from './decorators/currentUser.decorator';

@Controller()
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  @UseGuards(AuthLocalGuard)
  @Post('signin')
  public async signin(@CurrentUser() user: AuthenticatedUser) {
    /* Генерируем для пользователя JWT-токен (в payload — tokenVersion для инвалидации при выходе) */
    return this.authService.auth({
      id: user.id,
      tokenVersion: user.tokenVersion,
    });
  }

  /**
   * Выход: увеличиваем tokenVersion пользователя — все старые JWT перестают приниматься.
   * Клиенту следует удалить сохранённый access_token после успешного ответа.
   */
  @UseGuards(AuthJwtGuard)
  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async signout(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.authService.signout(user.id);
  }

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    const isUserExistsByUsernameOrEmail =
      await this.usersService.hasExistsUserEntity([
        { username: createUserDto.username },
        { email: createUserDto.email },
      ]);

    if (isUserExistsByUsernameOrEmail) {
      throw userAlreadyExistsException;
    }

    return this.authService.signup(createUserDto);
  }
}
