import { SuccessResponse } from '../../common/swagger/success.response';
import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from '../dto/comment-response.dto';

export class CommentsResponse extends SuccessResponse {
  @ApiProperty({
    type: CommentResponseDto,
    description: 'data',
    isArray: true,
  })
  data: CommentResponseDto[];
}
