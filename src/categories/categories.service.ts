import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly postRepository: Repository<PostEntity>,
    private readonly utils: Utils,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find();
  }

  async getAllPostByCategoryId(
    id: number,
    page: number,
    itemSize: number,
  ): Promise<PostResponseDto[]> {
    await this.validateCategoryId(id);

    const postsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.category = :id', { id });

    let posts: PostEntity[];

    if (page === 0 || itemSize === 0) {
      posts = await postsQuery.getMany();
    } else if (page > 0 && itemSize > 0) {
      posts = await postsQuery
        .skip((page - 1) * itemSize)
        .take(itemSize)
        .getMany();
    } else {
      throw new BadRequestException('페이지, 아이템 사이즈는 0 또는 양수여야 합니다.');
    }

    return posts.map((post) => {
      return this.utils.postEntityToPostResponseDto(post);
    });
  }

  private async validateCategoryId(id: number) {
    const isExist = await this.categoriesRepository.findOne({ id });
    if (!isExist) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
  }
}
