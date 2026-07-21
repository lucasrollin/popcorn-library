import { Router } from 'express';
import { z } from 'zod';
import { getFilm, getFilmRatings, searchFilms } from '../controllers/filmController.js';
import { validateParams } from '../middlewares/validate.js';

const router = Router();

const tmdbIdParams = z.object({ tmdbId: z.coerce.number().int().positive() });

router.get('/search', searchFilms);
router.get('/:tmdbId', validateParams(tmdbIdParams), getFilm);
router.get('/:tmdbId/ratings', validateParams(tmdbIdParams), getFilmRatings);

export default router;
