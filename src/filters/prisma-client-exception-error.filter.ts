import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status: HttpStatus;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: 'Conflict: Unique constraint failed',
          error: exception.meta,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Not Found: Record not found',
          error: exception.meta,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: 'Internal Server Error',
          error: exception.message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;
    }
  }
}
