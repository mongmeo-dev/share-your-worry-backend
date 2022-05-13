import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...responseData } = user;
      return responseData;
    }

    return null;
  }

  logout(request: Request): String {
    request.logout();
    request.session.cookie.maxAge = 0;
    return '로그아웃 성공';
  }
}
