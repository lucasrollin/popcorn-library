import { Request, Response } from 'express';
import {
  createRatingService,
  deleteRatingService,
  updateRatingService,
} from '../services/ratingService.js';

export const createRatingController = async (req: Request, res: Response) => {
  const { tmdbId, score } = req.body;
  const userId = req.user!.id;

  const result = await createRatingService(tmdbId, score, userId);

  res.status(201).json(result);
};

export const updateRatingController = async (req: Request<{ id: string }>, res: Response) => {
  const { score } = req.body;
  const userId = req.user!.id;

  const updatedRating = await updateRatingService(req.params.id, score, userId);

  res.json(updatedRating);
};

export const deleteRatingController = async (req: Request<{ id: string }>, res: Response) => {
  const userId = req.user!.id;

  await deleteRatingService(req.params.id, userId);

  res.status(204).end();
};
