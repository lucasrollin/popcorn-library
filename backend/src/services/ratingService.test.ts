import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRatingService, updateRatingService } from './ratingService';
import { createRating, findRatingById, updateRating } from '../repositories/ratingRepository';
import { findOrCreateFilmByTmdbId } from './filmService';
import { Prisma } from '../generated/prisma/client';
import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import { ForbiddenError } from '../errors/ForbiddenError';

// Replace the whole repository module with fakes.
// Every export (findRatingById, updateRating, createRating, ...) becomes an empty vi.fn().
vi.mock('../repositories/ratingRepository');
// createRatingService also depends on filmService, so fake that module too.
vi.mock('./filmService');

describe('updateRatingService', () => {
  // Reset the fakes' memory (return values + call history) before each test,
  // so one test can't leak into the next.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws NotFoundError when the rating does not exist', async () => {
    // Situation: the repo reports "no rating with that id".
    vi.mocked(findRatingById).mockResolvedValue(null);

    await expect(updateRatingService('rating-1', 5, 'user-1')).rejects.toThrow(NotFoundError);
  });

  it('throws ForbiddenError when the rating belongs to another user', async () => {
    // Situation: the rating exists, but its owner is someone else.
    vi.mocked(findRatingById).mockResolvedValue({
      id: 'rating-1',
      score: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'someone-else',
      filmId: 'film-1',
    });

    await expect(updateRatingService('rating-1', 5, 'user-1')).rejects.toThrow(ForbiddenError);
  });

  it('updates the rating when the caller owns it', async () => {
    const existing = {
      id: 'rating-1',
      score: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1',
      filmId: 'film-1',
    };
    // Situation: the rating exists and the caller owns it.
    vi.mocked(findRatingById).mockResolvedValue(existing);
    vi.mocked(updateRating).mockResolvedValue({ ...existing, score: 5 });

    const result = await updateRatingService('rating-1', 5, 'user-1');

    // The service should hand the update off to the repo, correctly.
    expect(updateRating).toHaveBeenCalledWith('rating-1', { score: 5 });
    expect(updateRating).toHaveBeenCalledTimes(1);
    expect(result.score).toBe(5);
  });
});

describe('createRatingService', () => {
  // A full Film object — findOrCreateFilmByTmdbId returns a Film, so the fake
  // must match that shape for TypeScript, even though the service only reads .id.
  const fakeFilm = {
    id: 'film-1',
    tmdbId: 27205,
    imdbId: 'tt1375666',
    title: 'Inception',
    overview: null,
    posterUrl: null,
    releaseYear: 2010,
    tmdbRating: null,
    tmdbVotesCount: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Every test in this block resolves the film the same way; only the
    // createRating outcome changes per test.
    vi.mocked(findOrCreateFilmByTmdbId).mockResolvedValue(fakeFilm);
  });

  it('creates the rating and returns it', async () => {
    const createdRating = {
      id: 'rating-1',
      score: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1',
      filmId: 'film-1',
    };
    vi.mocked(createRating).mockResolvedValue(createdRating);

    const result = await createRatingService(27205, 5, 'user-1');

    // The service must forward the resolved film's id, not the tmdbId.
    expect(createRating).toHaveBeenCalledWith({ userId: 'user-1', filmId: 'film-1', score: 5 });
    expect(result).toBe(createdRating);
  });

  it('throws ConflictError when the film is already rated (Prisma P2002)', async () => {
    // A real instance of the Prisma error, so the service's
    // `instanceof PrismaClientKnownRequestError` check passes.
    const duplicateError = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: 'test',
    });
    vi.mocked(createRating).mockRejectedValue(duplicateError);

    await expect(createRatingService(27205, 5, 'user-1')).rejects.toThrow(ConflictError);
  });

  it('rethrows any non-P2002 error unchanged', async () => {
    vi.mocked(createRating).mockRejectedValue(new Error('boom'));

    await expect(createRatingService(27205, 5, 'user-1')).rejects.toThrow('boom');
  });
});
