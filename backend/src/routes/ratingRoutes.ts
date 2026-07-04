import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validate.js';
import {
  createRatingController,
  deleteRatingController,
  updateRatingController,
} from '../controllers/ratingController.js';

const router = Router();

const createRatingSchema = z.object({
  tmdbId: z.number().int().positive(),
  score: z.number().int().min(1).max(5),
});

const updateRatingSchema = z.object({
  score: z.number().int().min(1).max(5),
});

router.post('/', authenticate, validateBody(createRatingSchema), createRatingController);
router.patch('/:id', authenticate, validateBody(updateRatingSchema), updateRatingController);
router.delete('/:id', authenticate, deleteRatingController);

export default router;
