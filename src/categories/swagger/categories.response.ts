import { SuccessResponse } from '../../common/swagger/success.response';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../entity/category.entity';

export class CategoriesResponse extends SuccessResponse {
  @ApiProperty({
    type: CategoryEntity,
    description: 'data',
    isArray: true,
  })
  data: CategoryEntity[];
}
