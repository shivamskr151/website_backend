import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        success: false,
        message,
        error: 'Custom Exception',
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

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

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(
      {
        success: false,
        message,
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(
      {
        success: false,
        message,
        error: 'Forbidden',
        statusCode: HttpStatus.FORBIDDEN,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(
      {
        success: false,
        message,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(
      {
        success: false,
        message,
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(
      {
        success: false,
        message,
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
