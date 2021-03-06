import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class UserEntity {
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
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @Column('varchar', { length: 50, unique: true })
  email: string;

  @ApiProperty({
    example: 'password1234',
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Column('char', { length: 60 })
  password: string;

  @ApiProperty({
    example: 'nickname',
    description: '닉네임',
    required: true,
  })
  @MaxLength(15)
  @IsNotEmpty()
  @Column('varchar', { length: 15, unique: true })
  nickname: string;

  @ApiProperty({
    example: 'uploads/image.jpg',
    description: '프로필 이미지 경로',
  })
  @Column('varchar', { name: 'profile_image', default: null, length: 100 })
  profileImage: string;

  @ApiProperty({
    example: true,
    description: '이메일 인증 여부',
  })
  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;
}
