import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class UserUpdateRequestDto extends PartialType(OmitType(User, ['id', 'email'] as const)) {}
