import { RequestHandler } from 'express';
import { resolveSessionUser } from './resolveSessionUser.js';

export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  const result = await resolveSessionUser(req.cookies?.session);

  if (result.status === 'ok') {
    req.user = result.user;
    req.sessionTokenHash = result.tokenHash;
  }

  next();
};
