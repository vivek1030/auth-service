import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    let message = exceptionResponse.message ?? exceptionResponse;
    let error = exceptionResponse.error ?? null;

    if (typeof exceptionResponse.message === 'object') {
      message = error;
      error = exceptionResponse.message;
    }
    response.status(status).json({
      success: false,
      message: message,
      error: error,
    });
  }
}
