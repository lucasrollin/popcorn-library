import { ConflictError } from '../errors/ConflictError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import { Prisma } from '../generated/prisma/client';
import {
  createRating,
  deleteRating,
  findRatingById,
  updateRating,
} from '../repositories/ratingRepository';
import { findOrCreateFilmByTmdbId } from './filmService';

export type CreateRatingInput = {
  userId: string;
  filmId: string;
  score: number;
};

export type UpdateRatingInput = {
  score: number;
};

export const createRatingService = async (tmdbId: number, score: number, userId: string) => {
  const film = await findOrCreateFilmByTmdbId(tmdbId);

  try {
    return await createRating({ userId, filmId: film.id, score });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictError('ALREADY_RATED', 'Already rated');
    }
    throw error;
  }
};

export const updateRatingService = async (ratingId: string, score: number, userId: string) => {
  const rating = await findRatingById(ratingId);
  if (!rating) throw new NotFoundError('RATING_NOT_FOUND', 'Rating not found');
  if (rating.userId !== userId)
    throw new ForbiddenError('FORBIDDEN', 'You can only modify your own rating');

  return await updateRating(ratingId, { score });
};

export const deleteRatingService = async (ratingId: string, userId: string) => {
  const rating = await findRatingById(ratingId);
  if (!rating) throw new NotFoundError('RATING_NOT_FOUND', 'Rating not found');
  if (rating.userId !== userId)
    throw new ForbiddenError('FORBIDDEN', 'You can only delete your own rating');

  await deleteRating(ratingId);
};
