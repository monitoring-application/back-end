import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    message: string,
    method: string,
    path: string,
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => {
                    const ctx = context.switchToHttp();
                    const request = ctx.getRequest<Request>();
                    return {
                        statusCode: context.switchToHttp().getResponse().statusCode,
                        message: '',
                        method: request.method,
                        path: request.url,
                        data,
                    }
                }),
            );
    }
}