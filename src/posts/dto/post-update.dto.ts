import { PartialType, PickType } from '@nestjs/swagger';
import { PostEntity } from '../entity/post.entity';

export class PostUpdateDto extends PartialType(
  PickType(PostEntity, ['category', 'title', 'content'] as const),
) {}
