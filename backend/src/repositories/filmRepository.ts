import { prisma } from './prismaClient.js';
import { FilmDetails } from '../types/film.js';

export const findFilmByTmdbId = async (tmdbId: number) => {
  const film = await prisma.film.findUnique({ where: { tmdbId } });

  return film;
};

export const createFilm = async (data: FilmDetails) => {
  const createdFilm = await prisma.film.create({ data });

  return createdFilm;
};
