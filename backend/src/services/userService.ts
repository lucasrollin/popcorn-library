import argon2 from 'argon2';
import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import {
  anonymizeUser,
  findPublicProfileByUsername,
  findUserByUsername,
  updateUser,
} from '../repositories/userRepository';
import { generateToken } from '../utils/sessionToken';
import { deleteSessionByUserId } from '../repositories/sessionRepository';

export type UpdateProfileInput = {
  username?: string;
  avatar?: string | null;
};

export const getPublicProfileService = async (username: string) => {
  const user = await findPublicProfileByUsername(username);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  return user;
};

export const updateProfileService = async (userId: string, data: UpdateProfileInput) => {
  if (data.username) {
    const existing = await findUserByUsername(data.username);
    if (existing && existing.id !== userId) {
      throw new ConflictError('USERNAME_ALREADY_TAKEN', 'This username is already taken');
    }
  }

  return await updateUser(userId, data);
};

export const deleteAccountService = async (userId: string) => {
  const randomPassword = generateToken();
  const passwordHash = await argon2.hash(randomPassword);
  const data = {
    email: `deleted_${userId}@deleted.com`,
    username: `deleted_${userId}`,
    password: passwordHash,
    avatar: null,
    deletedAt: new Date(),
  };

  await anonymizeUser(userId, data);
  await deleteSessionByUserId(userId);
};
