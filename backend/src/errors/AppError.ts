export abstract class AppError extends Error {
  abstract readonly statusCode: number;

  constructor(
    public readonly errorCode: string,
    message: string,
  ) {
    super(message);
  }
}
