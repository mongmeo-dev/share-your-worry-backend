import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail({ id: +userId })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
