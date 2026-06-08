import { Request, Response } from 'express';
import { createRatingService } from '../services/ratingService';

export const createRatingController = async (req: Request, res: Response) => {
  const { tmdbId, score } = req.body;
  const userId = req.user!.id;

  const result = await createRatingService(tmdbId, score, userId);

  res.status(201).json(result);
};
