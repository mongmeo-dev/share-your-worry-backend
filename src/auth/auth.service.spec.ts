import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Utils } from '../common/utils';
import { mockUtils } from '../common/mock/mock.utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { mockUsersRepository } from '../users/mock/mock.users.repository';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import * as httpMocks from 'node-mocks-http';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository;
  let utils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository(),
        },
        { provide: Utils, useValue: mockUtils() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
    utils = module.get(Utils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const existUser = new UserEntity();
    existUser.email = '';

    beforeEach(async () => {
      existUser.password = await bcrypt.hash('b', 12);
      usersRepository.findOne.mockReturnValue(existUser);
    });

    it('should return null if user not exist', async () => {
      usersRepository.findOne.mockReturnValue(null);

      const result = await service.validateUser('', '');

      expect(result).toBeNull();
    });

    it('should return null if input wrong password', async () => {
      const loginData = { email: '', password: await bcrypt.hash('a', 12) };

      const result = await service.validateUser(loginData.email, loginData.password);

      expect(result).toBeNull();
    });

    it('should return userResponseDto object', async () => {
      const userResponse = new UserResponseDto();
      utils.userEntityToResponseDto.mockReturnValue(userResponse);
      const loginData = { email: '', password: 'b' };

      const result = await service.validateUser(loginData.email, loginData.password);

      expect(result).toBe(userResponse);
    });
  });

  describe('logout', () => {
    it('should return 로그아웃 성공', () => {
      const req = httpMocks.createRequest();
      req.logout = jest.fn();

      service.logout(req);

      expect(req.logout).toBeCalled();
    });
  });
});
