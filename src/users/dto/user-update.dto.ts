import { OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UserUpdateDto extends PartialType(OmitType(UserEntity, ['id', 'email'] as const)) {}
