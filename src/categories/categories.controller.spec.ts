import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { mockCategoriesService } from './mock/mock.categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService() }],
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should call service.getAllCategories', async () => {
      await controller.getAllCategories();
      expect(service.getAllCategories).toBeCalledTimes(1);
    });
  });

  describe('getAllPostsByCategoryId', () => {
    it('should call service.getAllPostByCategoryId with args(1, 1, 10)', async () => {
      await controller.getAllPostsByCategoryId(1, 1, 10);
      expect(service.getAllPostByCategoryId).toBeCalledWith(1, 1, 10);
    });
  });
});
