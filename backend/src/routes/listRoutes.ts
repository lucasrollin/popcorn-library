import { Router } from 'express';
import {
  createListController,
  getListController,
  getMyListsController,
  getPublicListsController,
  updateListController,
} from '../controllers/listController';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';
import { optionalAuthenticate } from '../middlewares/optionalAuthenticate';

const router = Router();

const createListSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().max(10000).optional(),
  isPublic: z.boolean().default(false),
});

export const updateListSchema = z.object({
  name: z.string().trim().min(1).max(256).optional(),
  description: z.string().max(10000).optional(),
  isPublic: z.boolean().optional(),
});

router.get('/me', authenticate, getMyListsController);
router.post('/', authenticate, validateBody(createListSchema), createListController);
router.get('/', getPublicListsController);
router.get('/:id', optionalAuthenticate, getListController);
router.patch('/:id', authenticate, validateBody(updateListSchema), updateListController);

export default router;
