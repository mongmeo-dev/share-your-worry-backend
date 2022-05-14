import { OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entity/post.entity';

export class PostCreateDto extends OmitType(PostEntity, [
  'id',
  'author',
  'created_at',
  'updated_at',
] as const) {}
