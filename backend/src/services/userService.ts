import argon2 from 'argon2';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import {
  anonymizeUserAndDeleteData,
  findPublicProfileByUsername,
  findUserByUsername,
  updateUser,
} from '../repositories/userRepository.js';
import { generateToken } from '../utils/sessionToken.js';
import { Prisma } from '../generated/prisma/client.js';
import type { User } from '../generated/prisma/client.js';

export type UpdateProfileInput = {
  username?: string;
  avatar?: string | null;
};

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
};

export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  username: user.username,
  avatar: user.avatar,
});

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
  try {
    return await updateUser(userId, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('USERNAME_ALREADY_TAKEN', 'This username is already taken');
    }
    throw error;
  }
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

  await anonymizeUserAndDeleteData(userId, data);
};
