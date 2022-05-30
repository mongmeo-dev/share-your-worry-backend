import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { mockPostsService } from './mock/mock.posts.service';
import { UserEntity } from '../users/entity/user.entity';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service;

  const loggedInUser: UserEntity = {
    id: 1,
    email: '',
    password: '',
    nickname: '',
    profileImage: null,
    emailVerified: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PostsService, useValue: mockPostsService() }],
      controllers: [PostsController],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost', () => {
    it('should call service.createPost with user, postCreateDto', async () => {
      const postCreateDto = new PostCreateDto();

      await controller.createPost(loggedInUser, postCreateDto);

      expect(service.createPost).toBeCalledWith(loggedInUser, postCreateDto);
    });
  });

  describe('getAllPostsCount', () => {
    it('should call service.getAllPostsCount', async () => {
      await controller.getAllPostsCount();

      expect(service.getAllPostsCount).toBeCalled();
    });
  });

  describe('getAllPosts', () => {
    it('should call service.getAllPosts with 1, 10', async () => {
      await controller.getAllPosts(1, 10);

      expect(service.getAllPosts).toBeCalledWith(1, 10);
    });

    it('should call service.getAllPosts with 0, 0', async () => {
      await controller.getAllPosts();

      expect(service.getAllPosts).toBeCalledWith(0, 0);
    });
  });

  describe('getPostById', () => {
    it('should call service.getPostById with 1', async () => {
      await controller.getPostById(1);

      expect(service.getPostById).toBeCalledWith(1);
    });
  });

  describe('updatePostById', () => {
    it('should call service.updatePostById with 1, loggedInUser, postUpdateDto', async () => {
      const postUpdateDto = new PostUpdateDto();

      await controller.updatePostById(1, loggedInUser, postUpdateDto);

      expect(service.updatePostById).toBeCalledWith(1, loggedInUser, postUpdateDto);
    });
  });

  describe('deletePostById', () => {
    it('should call service.deletePostById with 1, loggedInUser', async () => {
      await controller.deletePostById(1, loggedInUser);

      expect(service.deletePostById).toBeCalledWith(1, loggedInUser);
    });
  });

  describe('getCommentsCountByPostId', () => {
    it('should call service.getCommentsCountByPostId with 1', async () => {
      await controller.getCommentsCountByPostId(1);

      expect(service.getCommentsCountByPostId).toBeCalledWith(1);
    });
  });

  describe('getAllCommentsByPostId', () => {
    it('should call service.getAllCommentsByPostId with 1, 1, 10', async () => {
      await controller.getAllCommentsByPostId(1, 1, 10);

      expect(service.getAllCommentsByPostId).toBeCalledWith(1, 1, 10);
    });

    it('should call service.getAllPosts with 1, 0, 0', async () => {
      await controller.getAllCommentsByPostId(1);

      expect(service.getAllCommentsByPostId).toBeCalledWith(1, 0, 0);
    });
  });
});
