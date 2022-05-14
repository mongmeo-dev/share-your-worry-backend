import { PostEntity } from '../entity/post.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto extends OmitType(PostEntity, ['author'] as const) {
  @ApiProperty({
    type: UserResponseDto,
    description: '작성자 정보',
  })
  author: UserResponseDto;
}
