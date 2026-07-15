import { prisma } from './prismaClient.js';

export const createSession = async (data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) => {
  const session = await prisma.session.create({ data });
  return session;
};

export const findSessionByTokenHash = async (tokenHash: string) => {
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  return session;
};

export const deleteSessionByTokenHash = async (tokenHash: string) => {
  const session = await prisma.session.delete({ where: { tokenHash } });

  return session;
};

export const deleteExpiredSessions = async () => {
  const { count } = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return count;
};
