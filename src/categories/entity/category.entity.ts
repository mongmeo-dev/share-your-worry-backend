import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'category' })
export class CategoryEntity {
  @ApiProperty({
    example: 1,
    description: '카테고리 id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '진로/진학',
    description: '고민 카테고리 이름',
  })
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { length: 20, unique: true })
  name: string;
}
