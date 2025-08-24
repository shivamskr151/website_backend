import { ValidationUtil } from '@common/utils/validation.util';
import { StringUtil } from '@common/utils/string.util';

export class Helpers {
  static validateEmail(email: string): boolean {
    return ValidationUtil.isValidEmail(email);
  }

  static validatePassword(password: string): boolean {
    return ValidationUtil.isValidPassword(password);
  }

  static generateSlug(text: string): string {
    return StringUtil.slugify(text);
  }

  static capitalizeWords(text: string): string {
    return StringUtil.capitalizeWords(text);
  }

  static formatFileSize(bytes: number): string {
    return StringUtil.formatFileSize(bytes);
  }

  static generateRandomString(length: number = 8): string {
    return StringUtil.generateRandomString(length);
  }

  static sanitizeString(str: string): string {
    return ValidationUtil.sanitizeString(str);
  }

  static isValidUUID(uuid: string): boolean {
    return ValidationUtil.isValidUUID(uuid);
  }

  static isValidURL(url: string): boolean {
    return ValidationUtil.isValidURL(url);
  }

  static maskEmail(email: string): string {
    return StringUtil.maskEmail(email);
  }

  static maskPhoneNumber(phone: string): string {
    return StringUtil.maskPhoneNumber(phone);
  }
}
