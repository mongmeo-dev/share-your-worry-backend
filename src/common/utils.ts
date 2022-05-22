import { UserEntity } from '../users/entity/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  removePasswordFromUser(user: UserEntity): UserResponseDto {
    const { password, ...responseData } = user;
    return responseData;
  }

  postEntityToPostResponseDto(post: PostEntity): PostResponseDto {
    return { ...post, author: this.removePasswordFromUser(post.author) };
  }

  commentsEntityToCommentResponseDto(comment: CommentEntity): CommentResponseDto {
    const { post, ...data } = comment;
    return { ...data, author: this.removePasswordFromUser(comment.author) };
  }
}
