import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};
