import { AppError } from './AppError';

export class NotFoundError extends AppError {
  readonly statusCode: number = 404;
}
