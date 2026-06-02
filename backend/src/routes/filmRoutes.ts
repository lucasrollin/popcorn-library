import { Router } from 'express';
import { getFilm, searchFilms } from '../controllers/filmController';

const router = Router();

router.get('/search', searchFilms);
router.get('/:tmdbId', getFilm);

export default router;
