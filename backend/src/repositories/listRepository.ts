import { prisma } from './prismaClient.js';
import { CreateListInput, UpdateListInput } from '../services/listService.js';

export const createList = async (data: CreateListInput) => {
  const createdList = await prisma.list.create({ data });

  return createdList;
};

export const findListsByUserId = async (userId: string) => {
  const lists = await prisma.list.findMany({
    where: { userId },
    include: { listFilms: { select: { film: { select: { tmdbId: true } } } } },
  });

  return lists;
};

export const findPublicLists = async () => {
  const publicLists = await prisma.list.findMany({ where: { isPublic: true } });

  return publicLists;
};

export const deleteListsByUserId = async (userId: string) => {
  return await prisma.$transaction([
    prisma.listFilm.deleteMany({ where: { list: { userId } } }),
    prisma.list.deleteMany({ where: { userId } }),
  ]);
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

export const deleteList = async (listId: string) => {
  const deletedList = await prisma.$transaction([
    prisma.listFilm.deleteMany({ where: { listId } }),
    prisma.list.delete({ where: { id: listId } }),
  ]);

  return deletedList;
};

export const addFilmToList = async (listId: string, filmId: string) => {
  const listFilm = await prisma.listFilm.create({ data: { listId, filmId } });

  return listFilm;
};

export const removeFilmFromList = async (listId: string, filmId: string) => {
  return await prisma.listFilm.delete({ where: { listId_filmId: { listId, filmId } } });
};
