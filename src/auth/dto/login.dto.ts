import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../users/entity/user.entity';

export class LoginDto extends PickType(UserEntity, ['email', 'password']) {}
