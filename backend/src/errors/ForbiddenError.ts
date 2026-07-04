import { AppError } from './AppError.js';

export class ForbiddenError extends AppError {
  readonly statusCode: number = 403;
}
