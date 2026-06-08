import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import { Prisma } from '../generated/prisma/client';
import { findFilmByTmdbId } from '../repositories/filmRepository';
import {
  addFilmToList,
  createList,
  deleteList,
  findListById,
  findListsByUserId,
  findPublicLists,
  removeFilmFromList,
  updateList,
} from '../repositories/listRepository';
import { findOrCreateFilmByTmdbId } from './filmService';

export type CreateListInput = {
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
};

export type UpdateListInput = {
  name?: string;
  description?: string;
  isPublic?: boolean;
};

export const createListService = async (data: CreateListInput) => {
  return await createList(data);
};

export const findListsByUserIdService = async (userId: string) => {
  return await findListsByUserId(userId);
};

export const findPublicListsService = async () => {
  return await findPublicLists();
};

export const getListByIdService = async (listId: string, requestingUserId?: string) => {
  const list = await findListById(listId);

  if (!list) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  if (!list.isPublic && list.userId !== requestingUserId) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  return list;
};

export const updateListService = async (listId: string, requestingUserId: string, data: UpdateListInput) => {
  const list = await findListById(listId);
  if (!list) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');
  if (list.userId !== requestingUserId) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  return await updateList(listId, data);
};

export const deleteListService = async (listId: string, requestingUserId: string) => {
  const list = await findListById(listId);
  if (!list) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');
  if (list.userId !== requestingUserId) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  await deleteList(listId);
};

export const addFilmToListService = async (listId: string, tmdbId: number, requestingUserId: string) => {
  const list = await findListById(listId);
  if (!list) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');
  if (list.userId !== requestingUserId) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  const film = await findOrCreateFilmByTmdbId(tmdbId);

  try {
    return await addFilmToList(listId, film.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('FILM_ALREADY_IN_LIST', 'This film is already in the list');
    }
    throw error;
  }
};

export const removeFilmFromListService = async (listId: string, tmdbId: number, requestingUserId: string) => {
  const list = await findListById(listId);
  if (!list) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');
  if (list.userId !== requestingUserId) throw new NotFoundError('LIST_NOT_FOUND', 'List not found');

  const film = await findFilmByTmdbId(tmdbId);
  if (!film) throw new NotFoundError('FILM_NOT_IN_LIST', 'Film not in list');

  try {
    return await removeFilmFromList(listId, film.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundError('FILM_NOT_IN_LIST', 'Film not in list');
    }
    throw error;
  }
};
