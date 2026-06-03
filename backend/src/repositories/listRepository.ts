import { prisma } from './prismaClient';
import { CreateListInput } from '../services/listService';

export async function createList(data: CreateListInput) {
  const createdList = await prisma.list.create({ data });

  return createdList;
}
