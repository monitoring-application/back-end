import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';
import { GlobalResponseError } from './global.response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message.message;
        // let code = 'HttpException';
        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);
        let status = HttpStatus.BAD_REQUEST;

        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                message = (exception as any).message;
                break;
            case QueryFailedError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                // code = (exception as any).code;
                break;
            case EntityNotFoundError:  // this is another TypeOrm error
                status = HttpStatus.NOT_FOUND
                message = (exception as EntityNotFoundError).message;
                // code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = 'Entity error';
                // message = (exception as CannotCreateEntityIdMapError).message;
                // code = (exception as any).code;
                break;
            case UnauthorizedException: // and another
                status = HttpStatus.UNAUTHORIZED
                message = "Unauthorized Execption";
                // code = '403';
                break;
            default:
                status = HttpStatus.BAD_GATEWAY
                break;
        }
        response.status(status)
            .json(GlobalResponseError(status, message, request));
    }
}
