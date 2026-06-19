import { prisma } from './prismaClient';

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
