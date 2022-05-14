import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoinDto } from './dto/join.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { IsNotLoggedInGuard } from '../auth/guard/is-not-logged-in.guard';
import { IsLoggedInGuard } from '../auth/guard/is-logged-in.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { UserEntity } from './entity/user.entity';
import { Request } from 'express';
import { UserUpdateDto } from './dto/user-update.dto';
import { PostResponseDto } from '../posts/dto/post-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '회원가입',
  })
  @ApiCreatedResponse({
    description: '유저 회원가입 성공',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: '이메일 또는 닉네임이 이미 사용중이거나 데이터 검증 오류',
  })
  @ApiForbiddenResponse({
    description: '이미 로그인 된 상태에서 호출시 에러',
  })
  @UseGuards(IsNotLoggedInGuard)
  @Post()
  async join(@Body() joinDto: JoinDto): Promise<UserResponseDto> {
    return await this.usersService.join(joinDto);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 가져오기',
  })
  @ApiOkResponse({
    description: '유저 조회 성공',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Get()
  async getCurrentUserInfo(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return await this.usersService.getUserById(user.id);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 업데이트',
  })
  @ApiOkResponse({
    description: '유저 정보 업데이트 성공',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Put()
  async updateCurrentUser(
    @CurrentUser() user: UserEntity,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserById(user.id, userUpdateDto);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 삭제 및 로그아웃',
  })
  @ApiOkResponse({
    description: '유저 정보 삭제 및 로그아웃 성공',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Delete()
  async deleteCurrentUser(
    @Req() request: Request,
    @CurrentUser() user: UserEntity,
  ): Promise<string> {
    await this.usersService.logoutAndDeleteUserById(request, user.id);
    return 'ok';
  }

  @ApiOperation({
    summary: '특정 유저가 작성한 모든 게시물 가져오기',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: '유저 아이디',
  })
  @ApiOkResponse({
    description: '특정 유저가 작성한 모든 게시물 반환',
    type: PostResponseDto,
    isArray: true,
  })
  @Get('id/posts')
  async getAllPostsByUserId(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto[]> {
    return this.usersService.getAllPostByUserId(id);
  }
}
