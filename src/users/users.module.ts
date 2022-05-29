import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { Utils } from '../common/utils';
import { EmailVerificationEntity } from './entity/email-verification.entity';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity, EmailVerificationEntity]),
    EmailsModule,
  ],
  providers: [UsersService, Utils],
  controllers: [UsersController],
})
export class UsersModule {}
