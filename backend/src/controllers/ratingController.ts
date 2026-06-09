import { Request, Response } from 'express';
import { createRatingService, updateRatingService } from '../services/ratingService';
import { z } from 'zod';

export const createRatingController = async (req: Request, res: Response) => {
  const { tmdbId, score } = req.body;
  const userId = req.user!.id;

  const result = await createRatingService(tmdbId, score, userId);

  res.status(201).json(result);
};

export const updateRatingController = async (req: Request, res: Response) => {
  const schema = z.object({ id: z.uuid() });

  const result = schema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Rating id is invalid',
    });

    return;
  }

  const { score } = req.body;
  const userId = req.user!.id;

  const updatedRating = await updateRatingService(result.data.id, score, userId);

  res.json(updatedRating);
};
