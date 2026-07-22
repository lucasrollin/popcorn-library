import { hashToken } from '../utils/sessionToken.js';
import {
  findSessionByTokenHash,
  deleteSessionByTokenHash,
} from '../repositories/sessionRepository.js';
import { toUserResponse, UserResponse } from '../services/userService.js';

type SessionResolution =
  | { status: 'ok'; user: UserResponse; tokenHash: string }
  | { status: 'expired' }
  | { status: 'none' };

export const resolveSessionUser = async (
  rawToken: string | undefined,
): Promise<SessionResolution> => {
  if (!rawToken) {
    return { status: 'none' };
  }

  const tokenHash = hashToken(rawToken);
  const session = await findSessionByTokenHash(tokenHash);
  if (!session) {
    return { status: 'none' };
  }

  if (session.expiresAt <= new Date()) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    return { status: 'expired' };
  }

  if (session.user.deletedAt !== null) {
    deleteSessionByTokenHash(tokenHash).catch(() => {});
    return { status: 'none' };
  }

  return { status: 'ok', user: toUserResponse(session.user), tokenHash };
};
