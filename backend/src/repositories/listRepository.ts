import { prisma } from './prismaClient';
import { CreateListInput, UpdateListInput } from '../services/listService';

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

export const findListById = async (listId: string) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { listFilms: { include: { film: true } } },
  });

  return list;
};

export const updateList = async (listId: string, data: UpdateListInput) => {
  const updatedList = await prisma.list.update({
    where: { id: listId },
    data,
  });

  return updatedList;
};
