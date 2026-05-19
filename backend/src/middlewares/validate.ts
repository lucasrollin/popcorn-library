import { RequestHandler } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request body is invalid',
      });
      return;
    }
    req.body = result.data;
    next();
  };
};
