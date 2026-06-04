import { prisma } from './prismaClient';
import { CreateListInput } from '../services/listService';

export async function createList(data: CreateListInput) {
  const createdList = await prisma.list.create({ data });

  return createdList;
}

export const findListsByUserId = async (userId: string) => {
  const lists = await prisma.list.findMany({ where: { userId } });

  return lists;
};

export const findPublicLists = async () => {
  const publicLists = await prisma.list.findMany({ where: { isPublic: true } });

  return publicLists;
};
