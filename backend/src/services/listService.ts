import { NotFoundError } from '../errors/NotFoundError';
import {
  createList,
  findListById,
  findListsByUserId,
  findPublicLists,
  updateList,
} from '../repositories/listRepository';

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
