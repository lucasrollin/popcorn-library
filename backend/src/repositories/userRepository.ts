import { prisma } from './prismaClient';

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  return user;
}

export async function createUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  const createdUser = await prisma.user.create({
    data,
  });
  return createdUser;
}
