import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async join(joinRequestDto: JoinRequestDto): Promise<UserResponseDto> {
    await this.checkEmailAndNicknameOverlap(joinRequestDto.email, joinRequestDto.nickname);

    const hashedPassword = await bcrypt.hash(joinRequestDto.password, 12);
    joinRequestDto.password = hashedPassword;

    const newUser = await this.usersRepository.save(joinRequestDto);
    const { password, ...responseData } = newUser;

    return responseData;
  }

  private async checkEmailAndNicknameOverlap(email, nickname) {
    const existUser = await this.usersRepository.findOne({ where: [{ email }, { nickname }] });
    if (existUser && existUser.email === email) {
      throw new BadRequestException('이 이메일은 이미 사용중입니다.');
    }
    if (existUser && existUser.nickname === nickname) {
      throw new BadRequestException('이 닉네임은 이미 사용중입니다.');
    }
  }
}
