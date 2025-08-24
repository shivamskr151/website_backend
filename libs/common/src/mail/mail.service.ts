import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as ejs from 'ejs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>,
  ): Promise<void> {
    const templatePath = path.join(process.cwd(), 'views', `${template}.ejs`);
    
    try {
      const html = await ejs.renderFile(templatePath, data);
      await this.sendEmail(to, subject, html);
    } catch (error) {
      throw new Error(`Failed to send template email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    await this.sendTemplateEmail(
      to,
      'Welcome to Our Platform!',
      'welcome',
      { firstName },
    );
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    await this.sendTemplateEmail(
      to,
      'Password Reset Request',
      'password_reset',
      { resetUrl },
    );
  }

  async sendEmailVerification(to: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${verificationToken}`;
    
    await this.sendTemplateEmail(
      to,
      'Verify Your Email',
      'email_verification',
      { verificationUrl },
    );
  }
}
