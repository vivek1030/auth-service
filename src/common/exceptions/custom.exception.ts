import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: String, status: HttpStatus) {
    super(message, status);
  }
}
