import { z } from 'zod';
import { Request, Response } from 'express';
import {
  getFilmDetails,
  getRatingsByTmdbIdService,
  searchFilms as searchFilmsService,
} from '../services/filmService';

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

const paramsSchema = z.object({
  tmdbId: z.coerce.number().int().positive(),
});

export const getFilm = async (req: Request, res: Response) => {
  const result = paramsSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Film id is invalid',
    });

    return;
  }

  const { tmdbId } = result.data;

  const film = await getFilmDetails(tmdbId);

  res.json(film);
};

export const getFilmRatings = async (req: Request, res: Response) => {
  const result = paramsSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Film id is invalid',
    });

    return;
  }

  const { tmdbId } = result.data;

  const ratings = await getRatingsByTmdbIdService(tmdbId);

  res.json(ratings);
};
