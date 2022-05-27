import { SuccessResponse } from './success.response';
import { ApiProperty } from '@nestjs/swagger';

export class CountDataResponse extends SuccessResponse {
  @ApiProperty({
    example: 1,
    description: 'data',
  })
  data: number;
}
