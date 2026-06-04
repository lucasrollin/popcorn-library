import { createList, findListsByUserId, findPublicLists } from '../repositories/listRepository';

export type CreateListInput = {
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
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
