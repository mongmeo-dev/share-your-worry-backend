import { SuccessResponse } from '../../common/swagger/success.response';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserResponse extends SuccessResponse {
  @ApiProperty({
    type: UserResponseDto,
    description: 'data',
  })
  data: UserResponseDto;
}
