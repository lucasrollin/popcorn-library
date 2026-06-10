import { RequestHandler } from 'express';
import { hashToken } from '../utils/sessionToken';
import {
  findSessionByTokenHash,
  deleteSessionByTokenHash,
} from '../repositories/sessionRepository';

export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  const rawToken = req.cookies?.session;
  if (!rawToken) {
    return next();
  }

  const tokenHash = hashToken(rawToken);
  const session = await findSessionByTokenHash(tokenHash);
  if (!session) {
    return next();
  }

  if (session.expiresAt <= new Date()) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    return next();
  }

  if (session.user.deletedAt !== null) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    return next();
  }

  req.user = {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
  };

  req.sessionTokenHash = tokenHash;

  next();
};
