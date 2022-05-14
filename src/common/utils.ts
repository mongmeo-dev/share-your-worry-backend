import { UserEntity } from '../users/entity/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';

export class Utils {
  static removePasswordFromUser(user: UserEntity): UserResponseDto {
    const { password, ...responseData } = user;
    return responseData;
  }

  static postEntityToPostResponseDto(post: PostEntity): PostResponseDto {
    return { ...post, author: this.removePasswordFromUser(post.author) };
  }
}
