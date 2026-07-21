import { z } from 'zod';
import { Request, Response } from 'express';
import {
  getFilmDetails,
  getRatingsByTmdbIdService,
  searchFilms as searchFilmsService,
} from '../services/filmService.js';

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

export const getFilm = async (req: Request<{ tmdbId: string }>, res: Response) => {
  const film = await getFilmDetails(Number(req.params.tmdbId));

  res.json(film);
};

export const getFilmRatings = async (req: Request<{ tmdbId: string }>, res: Response) => {
  const ratings = await getRatingsByTmdbIdService(Number(req.params.tmdbId));

  res.json(ratings);
};
