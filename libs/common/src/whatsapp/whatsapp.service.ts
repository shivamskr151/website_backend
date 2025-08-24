import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import * as qrcode from 'qrcode';

@Injectable()
export class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor(private readonly configService: ConfigService) {
    this.client = twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
  }

  async sendMessage(to: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    variables: Record<string, string>,
  ): Promise<void> {
    try {
      await this.client.messages.create({
        body: this.replaceTemplateVariables(templateName, variables),
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      throw new Error(`Failed to send WhatsApp template message: ${error.message}`);
    }
  }

  async sendMediaMessage(
    to: string,
    mediaUrl: string,
    caption?: string,
  ): Promise<void> {
    try {
      await this.client.messages.create({
        body: caption,
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${to}`,
        mediaUrl: [mediaUrl],
      });
    } catch (error) {
      throw new Error(`Failed to send WhatsApp media message: ${error.message}`);
    }
  }

  async generateQRCode(data: string): Promise<string> {
    try {
      return await qrcode.toDataURL(data);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  async sendWelcomeMessage(to: string, firstName: string): Promise<void> {
    const message = `Welcome ${firstName}! 🎉\n\nThank you for joining our platform. We're excited to have you on board!\n\nIf you have any questions, feel free to reach out to our support team.`;
    
    await this.sendMessage(to, message);
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const message = `Your verification code is: ${code}\n\nThis code will expire in 10 minutes. Please do not share this code with anyone.`;
    
    await this.sendMessage(to, message);
  }

  private replaceTemplateVariables(
    template: string,
    variables: Record<string, string>,
  ): string {
    let message = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return message;
  }
}
