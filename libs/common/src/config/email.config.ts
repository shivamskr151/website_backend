import { ConfigService } from '@nestjs/config';

export const getEmailConfig = (configService: ConfigService) => ({
  host: configService.get<string>('SMTP_HOST'),
  port: configService.get<number>('SMTP_PORT'),
  secure: false,
  auth: {
    user: configService.get<string>('SMTP_USER'),
    pass: configService.get<string>('SMTP_PASS'),
  },
  from: configService.get<string>('EMAIL_FROM'),
});
