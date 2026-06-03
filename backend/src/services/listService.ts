import { createList } from '../repositories/listRepository';

export type CreateListInput = {
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
};

export const createListService = async (data: CreateListInput) => {
  return await createList(data);
};
