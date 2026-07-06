import { RequestHandler } from 'express';
import { hashToken } from '../utils/sessionToken.js';
import {
  findSessionByTokenHash,
  deleteSessionByTokenHash,
} from '../repositories/sessionRepository.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const authenticate: RequestHandler = async (req, _res, next) => {
  const rawToken = req.cookies?.session;
  if (!rawToken) {
    throw new UnauthorizedError('UNAUTHORIZED', 'Authentication required');
  }

  const tokenHash = hashToken(rawToken);
  const session = await findSessionByTokenHash(tokenHash);
  if (!session) {
    throw new UnauthorizedError('UNAUTHORIZED', 'Authentication required');
  }

  if (session.expiresAt <= new Date()) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    throw new UnauthorizedError('SESSION_EXPIRED', 'Your session has expired');
  }

  if (session.user.deletedAt !== null) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    throw new UnauthorizedError('UNAUTHORIZED', 'Authentication required');
  }

  req.user = {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
    avatar: session.user.avatar,
  };

  req.sessionTokenHash = tokenHash;

  next();
};
