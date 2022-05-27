import { SuccessResponse } from './success.response';
import { ApiProperty } from '@nestjs/swagger';

export class EmptyDataResponse extends SuccessResponse {
  @ApiProperty({
    example: {},
    description: 'data',
  })
  data: {};
}
