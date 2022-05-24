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
    private readonly utils: Utils,
  ) {}

  async join(joinDto: JoinDto): Promise<UserResponseDto> {
    await this.checkEmailAndNicknameOverlap(joinDto.email, joinDto.nickname);

    const hashedPassword = await bcrypt.hash(joinDto.password, 12);
    joinDto.password = hashedPassword;

    const newUser = await this.usersRepository.save(joinDto);

    return this.utils.removePasswordFromUser(newUser);
  }

  async getCurrentUserInfo(loggedInUser: UserEntity) {
    return this.utils.removePasswordFromUser(loggedInUser);
  }

  async updateCurrentUser(
    loggedInUser: UserEntity,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    if (userUpdateDto.nickname) {
      // email 변경은 허용하지 않음
      await this.checkEmailAndNicknameOverlap(null, userUpdateDto.nickname);
    }

    const updatedUser = await this.usersRepository.save({ ...loggedInUser, ...userUpdateDto });
    return this.utils.removePasswordFromUser(updatedUser);
  }

  async logoutAndDeleteCurrentUser(request: Request, loggedInUser: UserEntity): Promise<void> {
    request.logout();
    await this.usersRepository.delete({ id: loggedInUser.id });
  }

  async getAllPostsByUserId(id: number): Promise<PostResponseDto[]> {
    await this.validateUserId(id);

    const posts = await this.postsRepository.find({
      where: { author: id },
      relations: ['author', 'category'],
    });

    return posts.map((post) => this.utils.postEntityToPostResponseDto(post));
  }

  async uploadCurrentUserProfileImage(
    file: Express.Multer.File,
    loggedInUser: UserEntity,
  ): Promise<UserResponseDto> {
    if (!file) {
      loggedInUser.profile_img = null;
    } else {
      loggedInUser.profile_img = `images/${file.filename}`;
    }

    const savedUser = await this.usersRepository.save(loggedInUser);

    return this.utils.removePasswordFromUser(savedUser);
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

  private async validateUserId(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }
}
