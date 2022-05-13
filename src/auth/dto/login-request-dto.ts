import { PickType } from '@nestjs/swagger';
import { User } from '../../users/entity/user.entity';

export class LoginRequestDto extends PickType(User, ['email', 'password']) {}
