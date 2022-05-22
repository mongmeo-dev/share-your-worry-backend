import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { CommentEntity } from '../comments/entity/comment.entity';
import { CategoryEntity } from '../categories/entity/category.entity';
import { Utils } from '../common/utils';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, CategoryEntity, CommentEntity])],
  controllers: [PostsController],
  providers: [PostsService, Utils],
})
export class PostsModule {}
