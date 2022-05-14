import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { Utils } from '../common/utils';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find();
  }

  async getAllPostByCategoryId(id: number): Promise<PostResponseDto[]> {
    const posts = await this.postsRepository.find({
      where: { category: id },
      relations: ['author'],
    });

    return posts.map((post) => {
      return Utils.postEntityToPostResponseDto(post);
    });
  }
}
