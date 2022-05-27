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
import { UserEntity } from '../users/entity/user.entity';
import { ExceptionResponse } from '../common/swagger/exception.response';
import { EmptyDataResponse } from '../common/swagger/empty.data.response';
import { CommentResponse } from './swagger/comment.response';

@ApiTags('Comment')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글 등록하기',
  })
  @ApiCreatedResponse({
    description: '댓글 생성 성공',
    type: CommentResponse,
  })
  @ApiNotFoundResponse({
    description: '게시물을 찾을 수 없음',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Post()
  async createComment(
    @Body() commentCreateDto: CommentCreateDto,
    @CurrentUser() loggedInUser: UserEntity,
  ): Promise<CommentResponseDto> {
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
    type: CommentResponse,
  })
  @ApiNotFoundResponse({
    description: '댓글을 찾을 수 없음',
    type: ExceptionResponse,
  })
  @ApiForbiddenResponse({
    description: '댓글 작성자가 아닐 경우 에러',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Put(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentUpdateDto: CommentUpdateDto,
    @CurrentUser() loggedInUser: UserEntity,
  ): Promise<CommentResponseDto> {
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
    type: EmptyDataResponse,
  })
  @ApiNotFoundResponse({
    description: '댓글을 찾을 수 없음',
    type: ExceptionResponse,
  })
  @ApiForbiddenResponse({
    description: '댓글 작성자가 아닐 경우 에러',
    type: ExceptionResponse,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
    type: ExceptionResponse,
  })
  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() loggedInUser: UserEntity,
  ): Promise<void> {
    return await this.commentsService.deleteComment(id, loggedInUser);
  }
}
