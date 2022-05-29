import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('email_verification')
export class EmailVerificationEntity {
  @PrimaryColumn('char', { length: 37 })
  verificationCode: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ nullable: true })
  expire_at: Date;

  initExpireDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 30);
  }
}
