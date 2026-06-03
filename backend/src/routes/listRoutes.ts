import { Router } from 'express';
import { createListController } from '../controllers/listController';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

const createListSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().max(10000).optional(),
  isPublic: z.boolean().default(false),
});

router.post('/', authenticate, validateBody(createListSchema), createListController);

export default router;
