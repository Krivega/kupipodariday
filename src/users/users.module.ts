import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersModule } from '@/offers/offers.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersPresenter } from './users.presenter';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => {
      return OffersModule;
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersPresenter],
  exports: [UsersService, UsersPresenter],
})
export class UsersModule {}
