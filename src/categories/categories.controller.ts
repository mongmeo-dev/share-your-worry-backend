import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entity/category.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { ParseIntOrUndefinedPipe } from '../common/pipe/parse-int-or-undefined-pipe.service';

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
  @ApiQuery({
    name: 'page',
    example: 1,
    description: '페이지 번호(0이거나 넘기지 않으면 전체 게시물 반환, 기본값은 0)',
    required: false,
  })
  @ApiQuery({
    name: 'item-size',
    example: 10,
    description: '한 페이지에 보여줄 게시물 수(0이거나 넘기지 않으면 전체 게시물 반환, 기본값은 0)',
    required: false,
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: PostEntity,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Query param 검증 오류',
  })
  @ApiNotFoundResponse({
    description: '카테고리가 존재하지 않을시 에러',
  })
  @Get(':id/posts')
  async getAllPostsByCategoryId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntOrUndefinedPipe) page = 0,
    @Query('item-size', ParseIntOrUndefinedPipe) itemSize = 0,
  ): Promise<PostResponseDto[]> {
    return await this.categoriesService.getAllPostByCategoryId(id, page, itemSize);
  }
}
