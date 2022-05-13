import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: '회원 식별용 ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'mongmeo.dev@gmail.com',
    description: '이메일',
    required: true,
  })
  @Column()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'password1234',
    description: '비밀번호',
    required: true,
  })
  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'nickname',
    description: '닉네임',
    required: true,
  })
  @Column()
  @MaxLength(15)
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'http://imageurl.com/image',
    description: '프로필 이미지 url',
  })
  @Column({ default: null })
  profile_img: string;
}
