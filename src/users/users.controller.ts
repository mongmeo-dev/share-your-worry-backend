import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JoinRequestDto } from './dto/join-request.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { IsNotLoggedInGuard } from '../auth/guard/is-not-logged-in.guard';
import { IsLoggedInGuard } from '../auth/guard/is-logged-in.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { User } from './entity/user.entity';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';
import { Request } from 'express';

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
  async join(@Body() joinRequestDto: JoinRequestDto): Promise<UserResponseDto> {
    return await this.usersService.join(joinRequestDto);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 가져오기',
  })
  @ApiOkResponse({
    description: '유저 조회 성공',
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Get()
  async getCurrentUserInfo(@CurrentUser() user: User): Promise<UserResponseDto> {
    return await this.usersService.getUserById(user.id);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 업데이트',
  })
  @ApiOkResponse({
    description: '유저 정보 업데이트 성공',
    type: UserResponseDto,
  })
  @ApiForbiddenResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Put()
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() userUpdateRequestDto: UserUpdateRequestDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserById(user.id, userUpdateRequestDto);
  }

  @ApiOperation({
    summary: '로그인 된 유저 정보 삭제 및 로그아웃',
  })
  @ApiOkResponse({
    description: '유저 정보 삭제 및 로그아웃 성공',
  })
  @ApiForbiddenResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @UseGuards(IsLoggedInGuard)
  @Delete()
  async deleteCurrentUser(@Req() request: Request, @CurrentUser() user: User): Promise<string> {
    await this.usersService.logoutAndDeleteUserById(request, user.id);
    return 'ok';
  }
}
