import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '../entity/comment.entity';

export class CommentCreateDto extends PickType(CommentEntity, ['content', 'post'] as const) {}
