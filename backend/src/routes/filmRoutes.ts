import { Router } from 'express';
import { getFilm, getFilmRatings, searchFilms } from '../controllers/filmController.js';

const router = Router();

router.get('/search', searchFilms);
router.get('/:tmdbId', getFilm);
router.get('/:tmdbId/ratings', getFilmRatings);

export default router;
