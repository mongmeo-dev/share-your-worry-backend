import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { PostEntity } from '../posts/entity/post.entity';
import { Utils } from '../common/utils';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [UsersService, Utils],
  controllers: [UsersController],
})
export class UsersModule {}
