import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // ✅ Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: exception.message,
        prismaCode: exception.code,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ HTTP errors
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ❌ Unknown
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
