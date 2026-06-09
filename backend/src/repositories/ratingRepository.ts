import { prisma } from './prismaClient';
import { CreateRatingInput, UpdateRatingInput } from '../services/ratingService';

export const createRating = async (data: CreateRatingInput) => {
  const createdRating = await prisma.rating.create({ data });

  return createdRating;
};

export const findRatingById = async (id: string) => {
  const rating = await prisma.rating.findUnique({ where: { id } });

  return rating;
};

export const updateRating = async (id: string, data: UpdateRatingInput) => {
  const updatedRating = await prisma.rating.update({
    where: { id },
    data,
  });

  return updatedRating;
};
