import { prisma } from './prismaClient';
import { CreateRatingInput } from '../services/ratingService';

export const createRating = async (data: CreateRatingInput) => {
  const createdRating = await prisma.rating.create({ data });

  return createdRating;
};
