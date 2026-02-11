import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLocalGuard } from './guards/auth.guard';
import { AuthJwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

import type { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get<string>('jwt_secret'),
          signOptions: {
            expiresIn:
              configService.get<SignOptions['expiresIn']>('jwt_expires_in'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthLocalGuard,
    AuthJwtGuard,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
