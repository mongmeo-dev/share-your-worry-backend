import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JoinDto } from './dto/join.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Utils } from '../common/utils';
import { UserUpdateDto } from './dto/user-update.dto';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { PostEntity } from '../posts/entity/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async join(joinDto: JoinDto): Promise<UserResponseDto> {
    await this.checkEmailAndNicknameOverlap(joinDto.email, joinDto.nickname);

    const hashedPassword = await bcrypt.hash(joinDto.password, 12);
    joinDto.password = hashedPassword;

    const newUser = await this.usersRepository.save(joinDto);

    return Utils.removePasswordFromUser(newUser);
  }

  async getCurrentUserInfo(user: UserEntity) {
    return Utils.removePasswordFromUser(user);
  }

  async updateUserById(id: number, userUpdateDto: UserUpdateDto): Promise<UserResponseDto> {
    const user = await this.getUserByIdOr404(id);

    if (userUpdateDto.nickname) {
      await this.checkEmailAndNicknameOverlap(null, userUpdateDto.nickname);
    }

    const updatedUser = await this.usersRepository.save({ ...user, ...userUpdateDto });
    return Utils.removePasswordFromUser(updatedUser);
  }

  async logoutAndDeleteUserById(request: Request, id: number): Promise<void> {
    request.logout();
    request.session.cookie.maxAge = 0;
    await this.usersRepository.delete({ id });
  }

  async getAllPostByUserId(id: number): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.find({
      where: { author: id },
      relations: ['author', 'category'],
    });

    return posts.map((post) => Utils.postEntityToPostResponseDto(post));
  }

  async uploadProfileImageByUserId(
    file: Express.Multer.File,
    id: number,
  ): Promise<UserResponseDto> {
    const user = await this.getUserByIdOr404(id);
    if (!file) {
      user.profile_img = null;
    } else {
      user.profile_img = `images/${file.filename}`;
    }

    const savedUser = await this.usersRepository.save(user);

    return Utils.removePasswordFromUser(savedUser);
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

  private async getUserByIdOr404(id: number) {
    const user = this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return user;
  }
}
