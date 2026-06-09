import { ConflictError } from '../errors/ConflictError';
import { Prisma } from '../generated/prisma/client';
import { createRating } from '../repositories/ratingRepository';
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
