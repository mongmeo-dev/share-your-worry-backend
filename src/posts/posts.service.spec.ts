import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { mockPostsRepository } from './mock/mock.posts.repository';
import { CommentEntity } from '../comments/entity/comment.entity';
import { mockCommentsRepository } from '../comments/mock/mock.comments.repository';
import { CategoryEntity } from '../categories/entity/category.entity';
import { Utils } from '../common/utils';
import { mockUtils } from '../common/mock/mock.utils';
import { UserEntity } from '../users/entity/user.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { PostCreateDto } from './dto/post-create.dto';
import { mockCategoriesRepository } from '../categories/mock/mock.categories.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostUpdateDto } from './dto/post-update.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository;
  let commentsRepository;
  let categoriesRepository;
  let utils;

  const loggedInUser: UserEntity = {
    id: 1,
    email: '',
    password: '',
    nickname: '',
    profile_img: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(PostEntity), useValue: mockPostsRepository() },
        { provide: getRepositoryToken(CommentEntity), useValue: mockCommentsRepository() },
        { provide: getRepositoryToken(CategoryEntity), useValue: mockCategoriesRepository() },
        { provide: Utils, useValue: mockUtils() },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get(getRepositoryToken(PostEntity));
    commentsRepository = module.get(getRepositoryToken(CommentEntity));
    categoriesRepository = module.get(getRepositoryToken(CategoryEntity));
    utils = module.get(Utils);

    utils.postEntityToPostResponseDto.mockReturnValue(new PostResponseDto());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    const savedPost = new PostEntity();
    const postCreateDto = new PostCreateDto();
    const category = new CategoryEntity();
    category.id = 1;
    postCreateDto.category = category;

    beforeEach(() => {
      categoriesRepository.findOne.mockReturnValue(new PostEntity());
      postsRepository.save.mockReturnValue(savedPost);
    });

    it('should call utils.postEntityToPostResponseDto with saved post', async () => {
      await service.createPost(loggedInUser, postCreateDto);

      expect(utils.postEntityToPostResponseDto).toBeCalledWith(savedPost);
    });

    it('should return savedPost(is instance of PostResponseDto)', async () => {
      const result = await service.createPost(loggedInUser, postCreateDto);

      expect(result).toBeInstanceOf(PostResponseDto);
    });
  });

  describe('getAllPostsCount', () => {
    it('should return all posts count', async () => {
      postsRepository.count.mockReturnValue(10);

      const result = await service.getAllPostsCount();

      expect(result).toBe(10);
    });
  });

  describe('getAllPosts', () => {
    it('should not call skip and take if page === 0', async () => {
      await service.getAllPosts(0, 1);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should not call skip and take if itemSize === 0', async () => {
      await service.getAllPosts(1, 0);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should call skip and take if page > 0 || itemSize > 0', async () => {
      await service.getAllPosts(1, 2);
      expect(postsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(1);
      expect(postsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPostById', () => {
    it('should fail if post not exist', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.getPostById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should call utils.postEntityToPostResponseDto with found post', async () => {
      const post = new PostEntity();
      postsRepository.createQueryBuilder().getOne.mockReturnValue(post);
      // utils.postEntityToPostResponseDto.mockReturnValue(new PostResponseDto());

      await service.getPostById(1);

      expect(utils.postEntityToPostResponseDto).toBeCalledWith(post);
    });
  });

  describe('updatePostById', () => {
    const postUpdateDto = new PostUpdateDto();
    const post = new PostEntity();
    it('should fail if post not exist', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.updatePostById(1, loggedInUser, postUpdateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should fail if loggedIn user is not author of post', async () => {
      post.author = {
        id: 2,
        email: '',
        nickname: '',
        password: '',
        profile_img: null,
      };
      postsRepository.createQueryBuilder().getOne.mockReturnValue(post);

      try {
        await service.updatePostById(1, loggedInUser, postUpdateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should call utils.postEntityToPostResponseDto with savedPost', async () => {
      const category: CategoryEntity = { id: 1, name: '' };
      const updatedPost = new PostEntity();
      post.author = loggedInUser;
      postUpdateDto.category = category;
      postsRepository.createQueryBuilder().getOne.mockReturnValue(post);
      postsRepository.save.mockReturnValue(updatedPost);
      categoriesRepository.findOne.mockReturnValue(category);

      await service.updatePostById(1, loggedInUser, postUpdateDto);

      expect(utils.postEntityToPostResponseDto).toBeCalledWith(updatedPost);
    });
  });

  describe('deletePostById', () => {
    const post = new PostEntity();

    it('should fail if post not exist', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.deletePostById(1, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should fail if loggedIn user is not author of post', async () => {
      const author: UserEntity = {
        id: 2,
        email: '',
        nickname: '',
        password: '',
        profile_img: null,
      };
      post.author = author;
      postsRepository.createQueryBuilder().getOne.mockReturnValue(post);

      try {
        await service.deletePostById(1, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should call postRepository.delete with id', async () => {
      post.author = loggedInUser;
      postsRepository.createQueryBuilder().getOne.mockReturnValue(post);

      await service.deletePostById(1, loggedInUser);

      expect(postsRepository.delete).toBeCalledWith({ id: 1 });
    });
  });

  describe('getAllCommentsByPostId', () => {
    beforeEach(() => {
      commentsRepository.createQueryBuilder().getMany.mockReturnValue([]);
      postsRepository.findOne.mockReturnValue(new PostEntity());
    });

    it('should fail if post not exist', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.getAllCommentsByPostId(1, 0, 0);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should not call skip and take if page === 0', async () => {
      await service.getAllCommentsByPostId(1, 0, 1);
      expect(commentsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(commentsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should not call skip and take if itemSize === 0', async () => {
      await service.getAllCommentsByPostId(1, 1, 0);
      expect(commentsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(0);
      expect(commentsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(0);
    });

    it('should call skip and take if page > 0 || itemSize > 0', async () => {
      await service.getAllCommentsByPostId(1, 2, 2);
      expect(commentsRepository.createQueryBuilder().skip).toHaveBeenCalledTimes(1);
      expect(commentsRepository.createQueryBuilder().take).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCommentsCountByPostId', () => {
    it('should fail if post not exist', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.getCommentsCountByPostId(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return the number of comments on the post', async () => {
      postsRepository.createQueryBuilder().getOne.mockReturnValue(new PostEntity());
      postsRepository.findOne.mockReturnValue(new PostEntity());
      commentsRepository.count.mockReturnValue(10);

      const result = await service.getCommentsCountByPostId(1);

      expect(result).toBe(10);
    });
  });
});
