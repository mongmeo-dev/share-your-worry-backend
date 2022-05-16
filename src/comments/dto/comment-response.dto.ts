import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CommentEntity } from '../entity/comment.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CommentResponseDto extends OmitType(CommentEntity, ['author', 'post'] as const) {
  @ApiProperty({
    type: UserResponseDto,
    description: '작성자 정보',
  })
  author: UserResponseDto;
}
