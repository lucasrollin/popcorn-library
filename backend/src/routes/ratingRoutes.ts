import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validate';
import { createRatingController } from '../controllers/ratingController';

const router = Router();

const createRatingSchema = z.object({
  tmdbId: z.number().int().positive(),
  score: z.number().int().min(1).max(5),
});

router.post('/', authenticate, validateBody(createRatingSchema), createRatingController);

export default router;
