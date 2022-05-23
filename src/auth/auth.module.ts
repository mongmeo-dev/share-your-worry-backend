import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { LocalSerializer } from './local.serializer';
import { Utils } from '../common/utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'local',
      session: true,
    }),
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer, Utils],
  controllers: [AuthController],
})
export class AuthModule {}
