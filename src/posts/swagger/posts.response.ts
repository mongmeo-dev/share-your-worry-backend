import { SuccessResponse } from '../../common/swagger/success.response';
import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../dto/post-response.dto';

export class PostsResponse extends SuccessResponse {
  @ApiProperty({
    type: PostResponseDto,
    description: 'data',
    isArray: true,
  })
  data: PostResponseDto[];
}
