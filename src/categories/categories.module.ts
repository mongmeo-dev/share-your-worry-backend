import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { Utils } from '../common/utils';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, PostEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, Utils],
})
export class CategoriesModule {}
