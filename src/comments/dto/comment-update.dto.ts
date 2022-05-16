import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '../entity/comment.entity';

export class CommentUpdateDto extends PickType(CommentEntity, ['content'] as const) {}
