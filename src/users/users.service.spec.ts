import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { mockUsersRepository } from './mock/mock.users.repository';
import { PostEntity } from '../posts/entity/post.entity';
import { mockPostsRepository } from '../posts/mock/mock.posts.repository';
import { Utils } from '../common/utils';
import { mockUtils } from '../common/mock/mock.utils';
import { JoinDto } from './dto/join.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as httpMocks from 'node-mocks-http';
import { UserUpdateDto } from './dto/user-update.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository;
  let postsRepository;
  let utils;

  const loggedInUser: UserEntity = {
    id: 1,
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUsersRepository() },
        { provide: getRepositoryToken(PostEntity), useValue: mockPostsRepository() },
        { provide: Utils, useValue: mockUtils() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
    postsRepository = module.get(getRepositoryToken(PostEntity));
    utils = module.get(Utils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('join', () => {
    const joinDto: JoinDto = { email: 'test@test.com', password: 'test1234', nickname: 'test' };
    let user: UserEntity;

    beforeEach(() => {
      user = new UserEntity();
      usersRepository.findOne.mockReturnValue(new UserEntity());
    });

    it('should fail if email already used', async () => {
      user.email = joinDto.email;

      try {
        await service.join(joinDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail if nickname already used', async () => {
      user.nickname = joinDto.nickname;

      try {
        await service.join(joinDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should call utils.removePasswordFromUser with savedUser', async () => {
      const savedUser = new UserEntity();
      usersRepository.findOne.mockReturnValue(null);
      usersRepository.save.mockReturnValue(savedUser);

      await service.join(joinDto);

      expect(utils.removePasswordFromUser).toBeCalledWith(savedUser);
    });
  });

  describe('getCurrentUserInfo', () => {
    it('should call utils.removePasswordFromUser with loggedInUser', async () => {
      await service.getCurrentUserInfo(loggedInUser);

      expect(utils.removePasswordFromUser).toBeCalledWith(loggedInUser);
    });
  });

  describe('updateCurrentUser', () => {
    const updateUserDto = new UserUpdateDto();

    it('should fail if nickname already used', async () => {
      usersRepository.findOne.mockReturnValue(new UserEntity());

      try {
        await service.updateCurrentUser(loggedInUser, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should call usersRepository.save()', async () => {
      await service.updateCurrentUser(loggedInUser, updateUserDto);

      expect(usersRepository.save).toBeCalled();
    });

    it('should call utils.removePasswordFromUser with updatedUser', async () => {
      const updatedUser = new UserEntity();
      usersRepository.save.mockReturnValue(updatedUser);
      await service.updateCurrentUser(loggedInUser, updateUserDto);

      expect(utils.removePasswordFromUser).toBeCalledWith(updatedUser);
    });
  });

  describe('logoutAndDeleteCurrentUser', () => {
    const req = httpMocks.createRequest();
    req.logout = jest.fn();
    it('should call request.logout', async () => {
      await service.logoutAndDeleteCurrentUser(req, loggedInUser);

      expect(req.logout).toBeCalled();
    });

    it('should call usersRepository.delete with {id: loggedInUser.id}', async () => {
      await service.logoutAndDeleteCurrentUser(req, loggedInUser);

      expect(usersRepository.delete).toBeCalledWith({ id: loggedInUser.id });
    });
  });

  describe('getAllPostByUserId', () => {
    it('should fail if user not exist', async () => {
      usersRepository.findOne.mockReturnValue(null);

      try {
        await service.getAllPostsByUserId(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should call utils.postEntityToPostResponseDto (posts.length) times', async () => {
      usersRepository.findOne.mockReturnValue(loggedInUser);
      postsRepository.find.mockReturnValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

      await service.getAllPostsByUserId(1);

      expect(utils.postEntityToPostResponseDto).toBeCalledTimes(10);
    });
  });
});
