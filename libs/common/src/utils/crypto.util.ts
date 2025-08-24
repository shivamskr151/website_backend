import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

export class CryptoUtil {
  private static configService: ConfigService;

  static setConfigService(configService: ConfigService) {
    CryptoUtil.configService = configService;
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService?.get<number>('BCRYPT_ROUNDS', 12) || 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomNumber(min: number = 100000, max: number = 999999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static generateToken(length: number = 64): string {
    return this.generateRandomString(length);
  }

  static generateVerificationCode(): string {
    return this.generateRandomNumber().toString();
  }
}
