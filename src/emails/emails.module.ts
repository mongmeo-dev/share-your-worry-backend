import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationEntity } from '../users/entity/email-verification.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationEntity]), ConfigService],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
