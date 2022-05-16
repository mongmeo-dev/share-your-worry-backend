import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CategoryEntity } from '../../categories/entity/category.entity';
import { UserEntity } from '../../users/entity/user.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CommentEntity } from '../../comments/entity/comment.entity';

@Entity({ name: 'post' })
export class PostEntity {
  @ApiProperty({
    example: 1,
    description: '게시물 id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '게시물 제목!',
    description: '게시물 제목',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Column('varchar', { length: 50 })
  title: string;

  @ApiProperty({
    example: '게시물 내용!!!',
    description: '게시물 내용',
  })
  @IsString()
  @IsNotEmpty()
  @Column('text')
  content: string;

  @ApiProperty({
    type: UserResponseDto,
    description: '작성자 id',
  })
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  author: UserEntity;

  @ApiProperty({
    example: 1,
    description: '속한 카테고리 id',
  })
  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  category: CategoryEntity;

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
