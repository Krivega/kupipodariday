import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersModule } from '@/offers/offers.module';
import { User } from './entities/user.entity';
import { UserPresenter } from './presenters/user.presenter';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => {
      return OffersModule;
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserPresenter],
  exports: [UsersService, UserPresenter],
})
export class UsersModule {}
