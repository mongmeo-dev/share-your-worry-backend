import { SuccessResponse } from '../../common/swagger/success.response';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse extends SuccessResponse {
  @ApiProperty({
    type: UserResponseDto,
    description: 'data',
  })
  data: UserResponseDto;
}
