import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentEntity } from './entity/comment.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { mockPostsRepository } from '../posts/mock/mock.posts.repository';
import { mockCommentsRepository } from './mock/mock.comments.repository';
import { UserEntity } from '../users/entity/user.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentCreateDto } from './dto/comment-create.dto';
import { Utils } from '../common/utils';
import { mockUtils } from '../common/mock/mock.utils';
import { CommentUpdateDto } from './dto/comment-update.dto';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentsRepository;
  let postsRepository;
  let utils;

  const author: UserEntity = { id: 1, email: '', password: '', profile_img: null, nickname: '' };
  const loggedInUser = new UserEntity();
  loggedInUser.id = 2;
  const comment = new CommentEntity();
  comment.author = author;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(CommentEntity), useValue: mockCommentsRepository() },
        { provide: getRepositoryToken(PostEntity), useValue: mockPostsRepository() },
        { provide: Utils, useValue: mockUtils() },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get(getRepositoryToken(CommentEntity));
    postsRepository = module.get(getRepositoryToken(PostEntity));
    utils = module.get(Utils);

    utils.commentsEntityToCommentResponseDto.mockReturnValue(new CommentResponseDto());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    const commentCreateDto: CommentCreateDto = { post: new PostEntity(), content: 'test' };

    it('should fail if category not exist', async () => {
      postsRepository.findOne.mockReturnValue(null);

      try {
        await service.createComment(commentCreateDto, author);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return saved comments(CommentResponseDto)', async () => {
      const newComment = new CommentEntity();
      newComment.author = author;
      postsRepository.findOne.mockReturnValue(new PostEntity());
      commentsRepository.save.mockReturnValue(newComment);

      const result = await service.createComment(commentCreateDto, author);

      expect(utils.commentsEntityToCommentResponseDto).toBeCalledWith(newComment);
      expect(result).toBeInstanceOf(CommentResponseDto);
    });
  });

  describe('updateComment', () => {
    const commentUpdateDto: CommentUpdateDto = { content: 'content' };

    it('should fail if comment not exist', async () => {
      commentsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.updateComment(1, commentUpdateDto, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should fail if logged in user is not author', async () => {
      commentsRepository.createQueryBuilder().getOne.mockReturnValue(comment);

      try {
        await service.updateComment(1, { content: '' }, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should return updated comment(CommentUpdateDto)', async () => {
      commentsRepository.createQueryBuilder().getOne.mockReturnValue(comment);
      commentsRepository.save.mockReturnValue(comment);

      const result = await service.updateComment(1, commentUpdateDto, author);

      expect(result).toBeInstanceOf(CommentResponseDto);
    });
  });

  describe('deleteComment', () => {
    it('should fail if comment not exist', async () => {
      commentsRepository.createQueryBuilder().getOne.mockReturnValue(null);

      try {
        await service.deleteComment(1, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should fail if logged in user is not author', async () => {
      const comment = new CommentEntity();
      comment.author = author;
      commentsRepository.createQueryBuilder().getOne.mockReturnValue(comment);

      try {
        await service.updateComment(1, { content: '' }, loggedInUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should call commentsRepository.delete with id', async () => {
      const comment = new CommentEntity();
      comment.author = loggedInUser;

      commentsRepository.createQueryBuilder().getOne.mockReturnValue(comment);
      await service.deleteComment(1, loggedInUser);

      expect(commentsRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
