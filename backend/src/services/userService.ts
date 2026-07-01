import { NotFoundError } from '../errors/NotFoundError';
import { findPublicProfileByUsername } from '../repositories/userRepository';

export const getPublicProfileService = async (username: string) => {
  const user = await findPublicProfileByUsername(username);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  return user;
};
