import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  readonly statusCode: number = 403;
}
