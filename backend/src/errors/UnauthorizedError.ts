import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  readonly statusCode: number = 401;
}
