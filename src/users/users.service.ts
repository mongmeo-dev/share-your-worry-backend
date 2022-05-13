import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  private removePasswordFromUser(user: User): UserResponseDto {
    const { password, ...responseData } = user;
    return responseData;
  }

  async join(joinRequestDto: JoinRequestDto): Promise<UserResponseDto> {
    await this.checkEmailAndNicknameOverlap(joinRequestDto.email, joinRequestDto.nickname);

    const hashedPassword = await bcrypt.hash(joinRequestDto.password, 12);
    joinRequestDto.password = hashedPassword;

    const newUser = await this.usersRepository.save(joinRequestDto);

    return this.removePasswordFromUser(newUser);
  }

  private async checkEmailAndNicknameOverlap(email: string, nickname: string): Promise<void> {
    const existUser = await this.usersRepository.findOne({ where: [{ email }, { nickname }] });
    if (existUser && existUser.email === email) {
      throw new BadRequestException('이 이메일은 이미 사용중입니다.');
    }
    if (existUser && existUser.nickname === nickname) {
      throw new BadRequestException('이 닉네임은 이미 사용중입니다.');
    }
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.usersRepository.findOneOrFail({ id });
      return this.removePasswordFromUser(user);
    } catch (err) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
  }

  async updateUserById(
    id: number,
    userUpdateRequestDto: UserUpdateRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.getUserById(id);

    if (userUpdateRequestDto.nickname) {
      await this.checkEmailAndNicknameOverlap(null, userUpdateRequestDto.nickname);
    }

    const updatedUser = await this.usersRepository.save({ ...user, ...userUpdateRequestDto });
    return this.removePasswordFromUser(updatedUser);
  }

  async logoutAndDeleteUserById(request: Request, id: number): Promise<DeleteResult> {
    request.logout();
    request.session.cookie.maxAge = 0;
    return await this.usersRepository.delete({ id });
  }

  async getAllPostByUserId(id: number) {
    // TODO: Post 서비스 완성되면 구현할 것.
  }
}
