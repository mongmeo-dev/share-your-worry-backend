import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostCreateDto } from './dto/post-create.dto';
import { IsLoggedInGuard } from '../auth/guard/is-logged-in.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostEntity } from './entity/post.entity';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserEntity } from '../users/entity/user.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { ParseIntOrUndefinedPipe } from '../common/pipe/parse-int-or-undefined-pipe.service';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '새 게시물 작성',
  })
  @ApiCreatedResponse({
    description: '게시물 생성 성공시 생성된 게시물 반환',
    type: PostEntity,
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 카테고리에 게시물 생성 시도시 에러',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Post()
  async createPost(
    @Body() postCreateDto: PostCreateDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PostResponseDto> {
    return await this.postsService.createPost(user, postCreateDto);
  }

  @ApiOperation({
    summary: '전체 게시물 수 가져오기',
  })
  @ApiOkResponse({
    description: '전체 게시물 수 반환',
  })
  @Get('/count')
  async getAllPostsCount(): Promise<number> {
    return await this.postsService.getAllPostsCount();
  }

  @ApiOperation({
    summary: '전체 게시물 가져오기',
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
    description: '전체 게시물 반환',
    type: PostResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Query param 검증 오류',
  })
  @Get()
  async getAllPosts(
    @Query('page', ParseIntOrUndefinedPipe) page = 0,
    @Query('item-size', ParseIntOrUndefinedPipe) itemSize = 0,
  ): Promise<PostResponseDto[]> {
    return await this.postsService.getAllPosts(page, itemSize);
  }

  @ApiOperation({
    summary: '특정 게시물 가져오기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '게시물 id',
  })
  @ApiOkResponse({
    description: '해당 게시물 반환',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return await this.postsService.getPostById(id);
  }

  @ApiOperation({
    summary: '특정 게시물 수정하기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '게시물 id',
  })
  @ApiOkResponse({
    description: '수정된 게시물 반환',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 카테고리로 게시물 수정 시도시 에러',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @UseGuards(IsLoggedInGuard)
  @Put(':id')
  async updatePostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
    @Body() postUpdateDto: PostUpdateDto,
  ): Promise<PostResponseDto> {
    return await this.postsService.updatePostById(id, user, postUpdateDto);
  }

  @ApiOperation({
    summary: '특정 게시물 삭제하기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '게시물 id',
  })
  @ApiOkResponse({
    description: '게시물 삭제 완료',
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @ApiForbiddenResponse({
    description: '게시물의 작성자가 아닌 유저가 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async deletePostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ): Promise<string> {
    await this.postsService.deletePostById(id, user);
    return 'ok';
  }

  @ApiOperation({
    summary: '특정 게시물에 달린 댓글 수 가져오기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '게시물 id',
  })
  @ApiOkResponse({
    description: '특정 게시물에 달린 전체 댓글 수 반환',
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @Get(':id/comments/count')
  async getCommentsCountByPostId(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.postsService.getCommentsCountByPostId(id);
  }

  @ApiOperation({
    summary: '특정 게시물에 달린 댓글 가져오기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '게시물 id',
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
    description: '한 페이지에 보여줄 댓글 수(0이거나 넘기지 않으면 전체 게시물 반환, 기본값은 0)',
    required: false,
  })
  @ApiOkResponse({
    description: '게시물에 달린 모든 댓글 반환',
    type: CommentResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Query param 검증 오류',
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @Get(':id/comments')
  async getAllCommentsByPostId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntOrUndefinedPipe) page = 0,
    @Query('item-size', ParseIntOrUndefinedPipe) itemSize = 0,
  ): Promise<CommentResponseDto[]> {
    return await this.postsService.getAllCommentsByPostId(id, page, itemSize);
  }
}
