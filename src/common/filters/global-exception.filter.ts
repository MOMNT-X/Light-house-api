import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: AbstractHttpAdapter) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const r = response as Record<string, unknown>;
        message = (r.message as string) || message;
        errors = Array.isArray(r.message) ? r.message : undefined;
        if (errors) message = 'Validation failed';
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error('Unhandled exception', exception);
    }

    const responseBody = {
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    this.httpAdapterHost.reply(ctx.getResponse(), responseBody, status);
  }
}
