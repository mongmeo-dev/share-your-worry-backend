import { Injectable } from '@nestjs/common';
import { EmailVerificationEntity } from '../users/entity/email-verification.entity';
import { UserEntity } from '../users/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailsService {
  constructor(private readonly configService: ConfigService) {}

  async sendVerifyEmail(user: UserEntity, emailVerificationEntity: EmailVerificationEntity) {
    AWS.config.update({ region: 'ap-northeast-2' });

    const baseUrl = this.configService.get('EMAIL_BASE_URL');

    const url = `${baseUrl}/users/email-verify?verificationCode=${emailVerificationEntity.verificationCode}`;

    const mailOptions = {
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
              <form action='${url}' method='POST'>
              <button>가입확인</button>
              </form>
             `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: '이메일을 인증해주세요',
        },
      },
      Source: this.configService.get('MAIL_ADDRESS'),
    };

    return await new AWS.SES().sendEmail(mailOptions).promise();
  }
}
