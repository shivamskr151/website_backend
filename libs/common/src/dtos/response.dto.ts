import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    path?: string,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }

  static success<T>(data: T, message = 'Success', path?: string): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data, path);
  }

  static error(message: string, path?: string): ApiResponseDto {
    return new ApiResponseDto(false, message, undefined, path);
  }
}
