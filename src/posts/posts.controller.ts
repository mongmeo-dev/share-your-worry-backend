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
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserEntity } from '../users/entity/user.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { CommentResponseDto } from '../comments/dto/comment-response.dto';
import { ParseIntOrUndefinedPipe } from '../common/pipe/parse-int-or-undefined-pipe.service';
import { EmptyDataResponse } from '../common/swagger/empty.data.response';
import { PostResponse } from './swagger/post.response';
import { CountDataResponse } from '../common/swagger/count.data.response';
import { PostsResponse } from './swagger/posts.response';
import { CommentsResponse } from '../comments/swagger/comments.response';
import { ExceptionResponse } from '../common/swagger/exception.response';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '새 게시물 작성',
  })
  @ApiCreatedResponse({
    description: '게시물 생성 성공시 생성된 게시물 반환',
    type: PostResponse,
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 카테고리에 게시물 생성 시도시 에러',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Post()
  async createPost(
    @CurrentUser() loggedInUser: UserEntity,
    @Body() postCreateDto: PostCreateDto,
  ): Promise<PostResponseDto> {
    return await this.postsService.createPost(loggedInUser, postCreateDto);
  }

  @ApiOperation({
    summary: '전체 게시물 수 가져오기',
  })
  @ApiOkResponse({
    description: '전체 게시물 수 반환',
    type: CountDataResponse,
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
    type: PostsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Query param 검증 오류',
    type: ExceptionResponse,
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
    type: PostResponse,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
    type: ExceptionResponse,
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
    type: PostResponse,
  })
  @ApiBadRequestResponse({
    description: '존재하지 않는 카테고리로 게시물 수정 시도시 에러',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Put(':id')
  async updatePostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() loggedInUser: UserEntity,
    @Body() postUpdateDto: PostUpdateDto,
  ): Promise<PostResponseDto> {
    return await this.postsService.updatePostById(id, loggedInUser, postUpdateDto);
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
    type: EmptyDataResponse,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @ApiForbiddenResponse({
    description: '게시물의 작성자가 아닌 유저가 호출시 에러',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async deletePostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() loggedInUser: UserEntity,
  ): Promise<void> {
    return await this.postsService.deletePostById(id, loggedInUser);
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
    type: CountDataResponse,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
    type: ExceptionResponse,
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
    type: CommentsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Query param 검증 오류',
    type: ExceptionResponse,
  })
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
    type: ExceptionResponse,
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
