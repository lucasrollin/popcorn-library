import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import {
  findPublicProfileByUsername,
  findUserByUsername,
  updateUser,
} from '../repositories/userRepository';

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
