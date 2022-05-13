import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JoinRequestDto } from './dto/join-request.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { IsNotLoggedInGuard } from '../auth/guard/is-not-logged-in.guard';

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
}
