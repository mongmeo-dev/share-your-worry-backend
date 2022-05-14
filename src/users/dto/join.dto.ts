import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class JoinDto extends PickType(UserEntity, ['email', 'password', 'nickname'] as const) {}
