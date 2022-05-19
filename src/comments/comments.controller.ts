import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsLoggedInGuard } from '../auth/guard/is-logged-in.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글 등록하기',
  })
  @ApiCreatedResponse({
    description: '댓글 생성 성공',
    type: CommentResponseDto,
  })
  @ApiNotFoundResponse({
    description: '게시물을 찾을 수 없음',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Post()
  async createComment(@Body() commentCreateDto: CommentCreateDto, @CurrentUser() loggedInUser) {
    return await this.commentsService.createComment(commentCreateDto, loggedInUser);
  }

  @ApiOperation({
    summary: '댓글 수정하기',
  })
  @ApiBody({
    type: CommentUpdateDto,
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '수정할 댓글 id',
  })
  @ApiOkResponse({
    description: '댓글 수정 성공',
    type: CommentResponseDto,
  })
  @ApiNotFoundResponse({
    description: '댓글을 찾을 수 없음',
  })
  @ApiForbiddenResponse({
    description: '댓글 작성자가 아닐 경우 에러',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Put(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentUpdateDto,
    @CurrentUser() loggedInUser,
  ) {
    return await this.commentsService.updateComment(id, commentUpdateDto, loggedInUser);
  }

  @ApiOperation({
    summary: '댓글 삭제하기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '삭제할 댓글 id',
  })
  @ApiOkResponse({
    description: '댓글 삭제 성공',
  })
  @ApiNotFoundResponse({
    description: '댓글을 찾을 수 없음',
  })
  @ApiForbiddenResponse({
    description: '댓글 작성자가 아닐 경우 에러',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number, @CurrentUser() loggedInUser) {
    return await this.commentsService.deleteComment(id, loggedInUser);
  }
}
