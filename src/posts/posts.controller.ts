import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostCreateDto } from './dto/post-create.dto';
import { IsLoggedInGuard } from '../auth/guard/is-logged-in.guard';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostEntity } from './entity/post.entity';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserEntity } from '../users/entity/user.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { PostUpdateDto } from './dto/post-update.dto';

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
    summary: '전체 게시물 가져오기',
  })
  @ApiOkResponse({
    description: '전체 게시물 반환',
    type: PostResponseDto,
    isArray: true,
  })
  @Get()
  async getAllPosts(): Promise<PostResponseDto[]> {
    return await this.postsService.getAllPosts();
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
    description: '전체 게시물 반환',
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
  @ApiNotFoundResponse({
    description: '해당하는 id의 게시물을 찾을 수 없음',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @ApiForbiddenResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Post(':id')
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
}
