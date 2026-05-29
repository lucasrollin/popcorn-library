import { Request, Response } from 'express';
import { searchFilms as searchFilmsService } from '../services/filmService';

export const searchFilms = async (req: Request, res: Response) => {
  const q = req.query.q;

  if (typeof q !== 'string') {
    return res.status(400).json({ error: 'MISSING_QUERY', message: 'The query is missing' });
  }

  const films = await searchFilmsService(q);

  res.json(films);
};
