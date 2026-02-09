/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Injectable } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  public create(_createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  public findAll() {
    return 'This action returns all auth';
  }

  public findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  public update(id: number, _updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  public remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
