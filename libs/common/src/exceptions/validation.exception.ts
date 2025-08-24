import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string, errors?: any[]) {
    super(
      {
        success: false,
        message,
        error: 'Validation Error',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
