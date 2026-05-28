import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ErrorResponse {
    success: false;
    error: {
        code: number;
        message: string;
        details?: any;
        timestamp: string;
        path: string;
    };
}
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
