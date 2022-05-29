import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUsersServices } from './mock/mock.users.services';
import { UserEntity } from './entity/user.entity';
import { JoinDto } from './dto/join.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import * as httpMocks from 'node-mocks-http';

describe('UsersController', () => {
  let controller: UsersController;
  let service;

  const loggedInUser: UserEntity = {
    id: 1,
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UsersService, useValue: mockUsersServices() }],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('join', () => {
    it('should call service.join with joinDto', async () => {
      const joinDto = new JoinDto();

      await controller.join(joinDto);

      expect(service.join).toBeCalledWith(joinDto);
    });
  });

  describe('getCurrentUserInfo', () => {
    it('should call service.getCurrentUserInfo with loggedInUser', async () => {
      await controller.getCurrentUserInfo(loggedInUser);

      expect(service.getCurrentUserInfo).toBeCalledWith(loggedInUser);
    });
  });

  describe('updateCurrentUser', () => {
    it('should call service.updateCurrentUser with loggedInUser, userUpdateDto', async () => {
      const userUpdateDto = new UserUpdateDto();

      await controller.updateCurrentUser(loggedInUser, userUpdateDto);

      expect(service.updateCurrentUser).toBeCalledWith(loggedInUser, userUpdateDto);
    });
  });

  describe('deleteCurrentUser', () => {
    it('should call service.deleteCurrentUser with request, loggedInUser', async () => {
      const req = httpMocks.createRequest();

      await controller.deleteCurrentUser(req, loggedInUser);

      expect(service.logoutAndDeleteCurrentUser).toBeCalledWith(req, loggedInUser);
    });
  });

  describe('getAllPostsByUserId', () => {
    it('should call service.getAllPostsByUserId with userId', async () => {
      await controller.getAllPostsByUserId(1);

      expect(service.getAllPostsByUserId).toBeCalledWith(1);
    });
  });
});
