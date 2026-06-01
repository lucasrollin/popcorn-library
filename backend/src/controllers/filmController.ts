import { z } from 'zod';
import { Request, Response } from 'express';
import { searchFilms as searchFilmsService } from '../services/filmService';

const searchQuerySchema = z.object({
  q: z.string().trim().min(1),
});

export const searchFilms = async (req: Request, res: Response) => {
  const result = searchQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Query is invalid',
    });

    return;
  }

  const { q } = result.data;

  const films = await searchFilmsService(q);

  res.json(films);
};
