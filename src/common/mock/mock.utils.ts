import { UserResponseDto } from '../../users/dto/user-response.dto';
import { PostResponseDto } from '../../posts/dto/post-response.dto';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export const mockUtils = () => ({
  removePasswordFromUser: jest.fn().mockReturnValue(new UserResponseDto()),
  postEntityToPostResponseDto: jest.fn().mockReturnValue(new PostResponseDto()),
  commentsEntityToCommentResponseDto: jest.fn().mockReturnValue(new CommentResponseDto()),
});