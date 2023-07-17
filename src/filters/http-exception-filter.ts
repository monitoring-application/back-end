import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        if (exception instanceof HttpException) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const status = exception.getStatus();
            const message = exception.message;
            const method = request.method
            response
                .status(status)
                .json({
                    statusCode: status,
                    message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    method,
                    data: null
                });

            // const errorResponse = exception.getResponse();
            // const errorMessage = (errorResponse as HttpExceptionResponse).message || exception.message;
            // return errorMessage;

        } else {
            return String(exception);
        }

    }
}