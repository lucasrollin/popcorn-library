import { Router } from 'express';
import {
  addFilmToListController,
  createListController,
  deleteListController,
  getListController,
  getMyListsController,
  getPublicListsController,
  removeFilmFromListController,
  updateListController,
} from '../controllers/listController.js';
import { z } from 'zod';
import { validateBody } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { optionalAuthenticate } from '../middlewares/optionalAuthenticate.js';

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

const addFilmSchema = z.object({ tmdbId: z.number().int().positive() });

router.get('/me', authenticate, getMyListsController);
router.post('/', authenticate, validateBody(createListSchema), createListController);
router.get('/', getPublicListsController);
router.get('/:id', optionalAuthenticate, getListController);
router.patch('/:id', authenticate, validateBody(updateListSchema), updateListController);
router.delete('/:id', authenticate, deleteListController);
router.post('/:id/films', authenticate, validateBody(addFilmSchema), addFilmToListController);
router.delete('/:id/films/:filmId', authenticate, removeFilmFromListController);

export default router;
