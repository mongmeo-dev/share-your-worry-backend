import { SuccessResponse } from '../../common/swagger/success.response';
import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../dto/post-response.dto';

export class PostResponse extends SuccessResponse {
  @ApiProperty({
    type: PostResponseDto,
    description: 'data',
  })
  data: PostResponseDto;
}
