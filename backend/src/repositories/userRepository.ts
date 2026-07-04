import { prisma } from './prismaClient.js';
import { UpdateProfileInput } from '../services/userService.js';

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  return user;
};

export const createUser = async (data: { email: string; username: string; password: string }) => {
  const createdUser = await prisma.user.create({
    data,
  });
  return createdUser;
};

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  return user;
};

export const findPublicProfileByUsername = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: { username, deletedAt: null },
    select: { id: true, username: true, avatar: true, createdAt: true },
  });

  return user;
};

export const updateUser = async (userId: string, data: UpdateProfileInput) => {
  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedProfile;
};

export const anonymizeUser = async (
  userId: string,
  data: {
    email: string;
    username: string;
    password: string;
    avatar: null;
    deletedAt: Date;
  },
) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};
