import { prisma } from './prismaClient.js';
import { FilmDetails } from '../types/film.js';

export const findFilmByTmdbId = async (tmdbId: number) => {
  const film = await prisma.film.findUnique({ where: { tmdbId } });

  return film;
};

export const createFilm = async (data: FilmDetails) => {
  // Champs explicites : Film n'a pas toutes les colonnes de FilmDetails (ex. backdropUrl)
  const createdFilm = await prisma.film.create({
    data: {
      tmdbId: data.tmdbId,
      imdbId: data.imdbId,
      title: data.title,
      overview: data.overview,
      posterUrl: data.posterUrl,
      releaseYear: data.releaseYear,
      tmdbRating: data.tmdbRating,
      tmdbVotesCount: data.tmdbVotesCount,
    },
  });

  return createdFilm;
};
