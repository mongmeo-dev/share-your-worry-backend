import { OmitType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class UserResponseDto extends OmitType(User, ['password'] as const) {}
