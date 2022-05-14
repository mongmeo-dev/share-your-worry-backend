import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class UserResponseDto extends OmitType(UserEntity, ['password'] as const) {}
