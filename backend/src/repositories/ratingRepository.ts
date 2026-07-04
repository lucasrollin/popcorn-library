import { prisma } from './prismaClient.js';
import { CreateRatingInput, UpdateRatingInput } from '../services/ratingService.js';

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

export const deleteRating = async (id: string) => {
  return await prisma.rating.delete({ where: { id } });
};

export const findRatingsByFilmId = async (filmId: string) => {
  const ratingsByFilmId = await prisma.rating.findMany({
    where: { filmId },
    include: { user: { select: { username: true, avatar: true } } },
  });

  return ratingsByFilmId;
};
