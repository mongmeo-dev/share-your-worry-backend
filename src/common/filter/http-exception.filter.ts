import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      error: string;
    };
    const message: string | string[] = exceptionResponse.message;
    const responseData = { success: false, statusCode: status, data: { messages: null } };

    if (typeof message === 'string') {
      responseData.data.messages = [message];
    } else {
      responseData.data.messages = message;
    }

    response.status(status).json(responseData);
  }
}
