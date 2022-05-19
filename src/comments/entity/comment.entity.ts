import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { UserEntity } from '../../users/entity/user.entity';
import { PostEntity } from '../../posts/entity/post.entity';

@Entity({ name: 'comment' })
export class CommentEntity {
  @ApiProperty({
    example: 1,
    description: '댓글 id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Column('varchar', { length: 100 })
  content: string;

  @ApiProperty({
    type: UserResponseDto,
    description: '작성자 객체',
  })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  author: UserEntity;

  @ApiProperty({
    example: 1,
    description: '댓글이 달린 게시물 id',
  })
  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  post: PostEntity;

  @ApiProperty({
    example: '2022-05-13T22:26:44.438Z',
    description: '생성 일자',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2022-05-13T22:26:44.438Z',
    description: '업데이트 일자',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
