import { Request } from 'express';

export const GlobalResponseError: (statusCode: number, message: string, request: Request) => IResponseError = (
    statusCode: number,
    message: string,
    request: Request
): IResponseError => {
    return {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method
    };
};

export interface IResponseError {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    method: string;
}