import { prisma } from './prismaClient';
import { FilmDetails } from '../types/film';

export const findFilmByTmdbId = async (tmdbId: number) => {
  const film = await prisma.film.findUnique({ where: { tmdbId } });

  return film;
};

export const createFilm = async (data: FilmDetails) => {
  const createdFilm = await prisma.film.create({ data });

  return createdFilm;
};
