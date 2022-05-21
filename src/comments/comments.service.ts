import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { Utils } from '../common/utils';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity) private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async createComment(
    commentCreateDto: CommentCreateDto,
    author: UserEntity,
  ): Promise<CommentResponseDto> {
    const targetPostId = commentCreateDto.post;
    const targetPost = await this.postsRepository.findOne({ where: { id: targetPostId } });
    if (!targetPost) {
      throw new NotFoundException('포스트를 찾을 수 없음');
    }

    const newComment = await this.commentsRepository.create({ ...commentCreateDto, author });
    const savedComment = await this.commentsRepository.save(newComment);

    return Utils.commentsEntityToCommentResponseDto(savedComment);
  }

  async updateComment(
    id: number,
    commentUpdateDto: CommentUpdateDto,
    loggedInUser: UserEntity,
  ): Promise<CommentResponseDto> {
    const comment = await this.getCommentWithAuthorByIdOrThrow404(id);
    this.isAuthor(loggedInUser, comment);

    const savedComment = await this.commentsRepository.save({ ...comment, ...commentUpdateDto });
    return Utils.commentsEntityToCommentResponseDto(savedComment);
  }

  async deleteComment(id: number, loggedInUser: UserEntity): Promise<string> {
    const comment = await this.getCommentWithAuthorByIdOrThrow404(id);
    this.isAuthor(loggedInUser, comment);

    await this.commentsRepository.delete({ id: id });
    return 'ok';
  }

  private async getCommentWithAuthorByIdOrThrow404(id: number): Promise<CommentEntity> {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.id = :id', { id })
      .getOne();
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없음');
    }
    return comment;
  }

  private isAuthor(loggedInUser: UserEntity, comment: CommentEntity) {
    if (comment.author.id !== loggedInUser.id) {
      throw new ForbiddenException('댓글의 작성자가 아닙니다.');
    }
  }
}
