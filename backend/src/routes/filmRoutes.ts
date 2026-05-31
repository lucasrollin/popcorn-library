import { Router } from 'express';
import { searchFilms } from '../controllers/filmController';

const router = Router();

router.get('/search', searchFilms);

export default router;
