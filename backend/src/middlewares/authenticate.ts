import { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { resolveSessionUser } from './resolveSessionUser.js';

export const authenticate: RequestHandler = async (req, _res, next) => {
  const result = await resolveSessionUser(req.cookies?.session);

  if (result.status === 'expired') {
    throw new UnauthorizedError('SESSION_EXPIRED', 'Your session has expired');
  }

  if (result.status === 'none') {
    throw new UnauthorizedError('UNAUTHORIZED', 'Authentication required');
  }

  req.user = result.user;
  req.sessionTokenHash = result.tokenHash;

  next();
};
