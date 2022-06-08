import { UserEntity } from '../users/entity/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  userEntityToResponseDto(user: UserEntity): UserResponseDto {
    const { password, ...responseData } = user;
    return responseData;
  }

  postEntityToResponseDto(post: PostEntity): PostResponseDto {
    return { ...post, author: this.userEntityToResponseDto(post.author) };
  }

  commentsEntityToResponseDto(comment: CommentEntity): CommentResponseDto {
    const { post, ...data } = comment;
    return { ...data, author: this.userEntityToResponseDto(comment.author) };
  }
}
