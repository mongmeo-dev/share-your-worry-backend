import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { CommentEntity } from '../comments/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CommentEntity])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
