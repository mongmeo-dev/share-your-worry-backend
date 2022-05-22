import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockCategoriesRepository } from './mock/mock.categories.repository';
import { CategoryEntity } from './entity/category.entity';
import { mockPostsRepository } from '../posts/mock/mock.posts.repository';
import { PostEntity } from '../posts/entity/post.entity';
import { NotFoundException } from '@nestjs/common';
import { Utils } from '../common/utils';
import { mockUtils } from '../common/mock/mock.utils';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository;
  let postsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(CategoryEntity), useValue: mockCategoriesRepository() },
        { provide: getRepositoryToken(PostEntity), useValue: mockPostsRepository() },
        { provide: Utils, useValue: mockUtils() },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get(getRepositoryToken(CategoryEntity));
    postsRepository = module.get(getRepositoryToken(PostEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      categoriesRepository.find.mockReturnValue([{ id: 1 }]);
      expect((await service.getAllCategories()).length).toBe(1);
    });
  });

  describe('getAllPostByCategoryId', () => {
    beforeEach(() => {
      categoriesRepository.findOne.mockReturnValue(1);
    });

    it('should fail if category not found', async () => {
      categoriesRepository.findOne.mockReturnValue(null);
      try {
        await service.getAllPostByCategoryId(1, 0, 0);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should not call skip and take if page === 0', async () => {
      await service.getAllPostByCategoryId(1, 0, 1);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should not call skip and take if itemSize === 0', async () => {
      await service.getAllPostByCategoryId(1, 1, 0);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should call skip and take if page > 0 || itemSize > 0', async () => {
      await service.getAllPostByCategoryId(1, 2, 2);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(1);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(1);
    });
  });
});
