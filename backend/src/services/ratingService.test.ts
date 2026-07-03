import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateRatingService } from './ratingService';
import { findRatingById, updateRating } from '../repositories/ratingRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { ForbiddenError } from '../errors/ForbiddenError';

// Replace the whole repository module with fakes.
// Every export (findRatingById, updateRating, ...) becomes an empty vi.fn().
vi.mock('../repositories/ratingRepository');

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
