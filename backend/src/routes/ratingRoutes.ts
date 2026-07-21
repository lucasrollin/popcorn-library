import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
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

const ratingIdParams = z.object({ id: z.uuid() });

router.post('/', authenticate, validateBody(createRatingSchema), createRatingController);
router.patch(
  '/:id',
  authenticate,
  validateParams(ratingIdParams),
  validateBody(updateRatingSchema),
  updateRatingController,
);
router.delete('/:id', authenticate, validateParams(ratingIdParams), deleteRatingController);

export default router;
