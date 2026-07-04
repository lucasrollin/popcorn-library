import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  readonly statusCode: number = 401;
}
