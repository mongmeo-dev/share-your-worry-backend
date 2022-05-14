import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth-guard';
import { IsNotLoggedInGuard } from './guard/is-not-logged-in.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: '로그인 성공',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 실패(아이디, 비밀번호 오류)',
  })
  @ApiForbiddenResponse({
    description: '이미 로그인 된 상태에서 호출시 에러',
  })
  @UseGuards(LocalAuthGuard)
  @UseGuards(IsNotLoggedInGuard)
  @HttpCode(200)
  @Post('/login')
  login(@Req() request: Request) {
    return request.user;
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @HttpCode(200)
  @ApiOkResponse({
    description: '로그아웃 성공',
  })
  @ApiForbiddenResponse({
    description: '로그인 되지 않은 상태에서 호출시 에러',
  })
  @Post('logout')
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
