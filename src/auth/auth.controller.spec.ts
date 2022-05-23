import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockAuthService } from './mock/mock.auth.service';
import * as httpMocks from 'node-mocks-http';

describe('AuthController', () => {
  let controller: AuthController;
  let service;

  const req = httpMocks.createRequest();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService() }],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logout', () => {
    it('should call service.logout with request', () => {
      controller.logout(req);

      expect(service.logout).toBeCalledWith(req);
    });
  });
});
