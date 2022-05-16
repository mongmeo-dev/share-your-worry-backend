import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entity/category.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: '모든 카테고리 조회',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: CategoryEntity,
    isArray: true,
  })
  @Get()
  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesService.getAllCategories();
  }

  @ApiOperation({
    summary: '카테고리에 속한 모든 게시물 조회',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '카테고리 id',
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: PostEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: '카테고리가 존재하지 않을시 에러',
  })
  @Get(':id/posts')
  async getAllPostsByCategoryId(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto[]> {
    return await this.categoriesService.getAllPostByCategoryId(id);
  }
}
