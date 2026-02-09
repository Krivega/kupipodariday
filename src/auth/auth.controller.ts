import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { AuthLocalGuard } from './guards/auth.guard';
import { AuthJwtGuard } from './guards/jwt.guard';

@Controller('auth')
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
  public async signin(@Req() req: Request) {
    const { user } = req;

    if (user === undefined) {
      throw new UnauthorizedException();
    }

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
  public async signout(@Req() req: Request): Promise<void> {
    const { user } = req;

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    await this.authService.signout(user.id);
  }

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    const isUserExistsByUsernameOrEmail = await this.usersService.hasExists([
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]);

    if (isUserExistsByUsernameOrEmail) {
      throw new ConflictException('User already exists');
    }

    return this.authService.signup(createUserDto);
  }
}
