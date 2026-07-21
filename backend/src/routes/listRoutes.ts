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
import { validateBody, validateParams } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { optionalAuthenticate } from '../middlewares/optionalAuthenticate.js';

const router = Router();

const createListSchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().max(10000).optional(),
  isPublic: z.boolean().default(false),
});

const updateListSchema = z.object({
  name: z.string().trim().min(1).max(256).optional(),
  description: z.string().max(10000).nullable().optional(),
  isPublic: z.boolean().optional(),
});

const addFilmSchema = z.object({ tmdbId: z.number().int().positive() });

const listIdParams = z.object({ id: z.uuid() });
const listFilmParams = z.object({
  id: z.uuid(),
  tmdbId: z.coerce.number().int().positive(),
});

router.get('/me', authenticate, getMyListsController);
router.post('/', authenticate, validateBody(createListSchema), createListController);
router.get('/', getPublicListsController);
router.get('/:id', optionalAuthenticate, validateParams(listIdParams), getListController);
router.patch(
  '/:id',
  authenticate,
  validateParams(listIdParams),
  validateBody(updateListSchema),
  updateListController,
);
router.delete('/:id', authenticate, validateParams(listIdParams), deleteListController);
router.post(
  '/:id/films',
  authenticate,
  validateParams(listIdParams),
  validateBody(addFilmSchema),
  addFilmToListController,
);
router.delete(
  '/:id/films/:tmdbId',
  authenticate,
  validateParams(listFilmParams),
  removeFilmFromListController,
);

export default router;
