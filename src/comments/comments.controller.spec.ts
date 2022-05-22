import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { mockCommentsService } from './mock/mock.comments.service';
import { UserEntity } from '../users/entity/user.entity';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;
  const loggedInUser = new UserEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CommentsService, useValue: mockCommentsService() }],
      controllers: [CommentsController],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should call commentService.createComment with commentCreateDto, loggedInUser', async () => {
      const createDto = new CommentCreateDto();

      await controller.createComment(createDto, loggedInUser);

      expect(service.createComment).toBeCalledWith(createDto, loggedInUser);
    });
  });

  describe('updateComment', () => {
    it('should call commentService.updateComment with 1, commentUpdateDto, loggedInUser', async () => {
      const updateDto = new CommentUpdateDto();

      await controller.updateComment(1, updateDto, loggedInUser);

      expect(service.updateComment).toBeCalledWith(1, updateDto, loggedInUser);
    });
  });

  describe('deleteComment', () => {
    it('should call commentService.deleteComment with 1, loggedInUser', async () => {
      await controller.deleteComment(1, loggedInUser);

      expect(service.deleteComment).toBeCalledWith(1, loggedInUser);
    });
  });
});
