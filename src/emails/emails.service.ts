import { Injectable } from '@nestjs/common';
import { EmailVerificationEntity } from '../users/entity/email-verification.entity';
import { UserEntity } from '../users/entity/user.entity';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: configService.get('GMAIL_ID'),
        pass: configService.get('GMAIL_PW'),
      },
    });
  }

  async sendVerifyEmail(user: UserEntity, emailVerificationEntity: EmailVerificationEntity) {
    const baseUrl = this.configService.get('EMAIL_BASE_URL');

    const url = `${baseUrl}/users/email-verify?verificationCode=${emailVerificationEntity.verificationCode}`;

    const mailOptions = {
      to: user.email,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action='${url}' method='POST'>
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
