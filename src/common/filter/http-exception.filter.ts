import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.logging(request, exception);
    const formattedResponse = this.formatResponse(exception);

    response.status(exception.getStatus()).json(formattedResponse);
  }

  private logging(request: Request, exception: HttpException) {
    const logger = new Logger('HTTP');
    const status = exception.getStatus();
    const loggingMsg = `url: ${request.originalUrl} | ip: ${request.ip} | status: ${status}`;

    if (status >= 500) {
      logger.error(loggingMsg);
    }
    logger.log(loggingMsg);
  }

  private formatResponse(exception: HttpException) {
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

    return responseData;
  }
}
