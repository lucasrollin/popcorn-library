import { prisma } from './prismaClient';

export async function createSession(data: { userId: string; tokenHash: string; expiresAt: Date }) {
  const session = await prisma.session.create({ data });
  return session;
}

export async function findSessionByTokenHash(tokenHash: string) {
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  return session;
}

export async function deleteSessionByTokenHash(tokenHash: string) {
  const session = await prisma.session.delete({ where: { tokenHash } });

  return session;
}
