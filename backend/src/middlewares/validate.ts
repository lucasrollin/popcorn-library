import { RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';

// Flatten Zod's issues into a compact, client-friendly list:
// [{ path: 'score', message: 'Too big: ...' }, ...]
const toFieldErrors = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

export const validateBody = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request body is invalid',
        details: toFieldErrors(result.error),
      });

      return;
    }
    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request parameters are invalid',
        details: toFieldErrors(result.error),
      });

      return;
    }
    req.params = result.data as typeof req.params;
    next();
  };
};
