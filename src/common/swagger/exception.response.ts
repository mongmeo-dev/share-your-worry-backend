import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponse {
  @ApiProperty({
    example: false,
    description: '응답 성공 여부',
  })
  success: boolean;

  @ApiProperty({
    example: 400,
    description: 'http 상태 코드',
  })
  statusCode: number;
  
  @ApiProperty({
    example: { messages: '검증 오류' },
    description: '에러 메세지',
  })
  data: { messages: string };
}
