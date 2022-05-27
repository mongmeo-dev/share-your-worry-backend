import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({
    example: true,
    description: '응답 성공 여부',
  })
  success: boolean;

  @ApiProperty({
    example: 200,
    description: 'http 상태 코드',
  })
  statusCode: number;
}
