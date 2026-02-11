import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import {
  SigninUserResponseDto,
  SignupUserResponseDto,
} from './dto/auth-response.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthLocalGuard } from './guards/auth.guard';
import { AuthJwtGuard } from './guards/jwt.guard';

import type { AuthenticatedUser } from './decorators/currentUser.decorator';

@ApiTags('auth')
@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthLocalGuard)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    description: 'JWT access token',
    type: SigninUserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid username or password',
  })
  public async login(
    @Body() _signinUserDto: SigninUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SigninUserResponseDto> {
    return this.authService.auth({
      id: user.id,
      tokenVersion: user.tokenVersion,
    });
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthJwtGuard)
  @ApiOperation({ summary: 'Sign out' })
  public async signout(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.authService.signout(user.id);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'Created user profile',
    type: SignupUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email or username is already registered',
  })
  public async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.authService.signup(createUserDto);
  }
}
