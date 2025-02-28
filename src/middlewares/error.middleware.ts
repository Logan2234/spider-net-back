import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
