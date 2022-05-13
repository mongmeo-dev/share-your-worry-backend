import { PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class JoinRequestDto extends PickType(User, ['email', 'password', 'nickname'] as const) {}
