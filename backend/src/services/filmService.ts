import { searchMovies, getMovieDetails } from '../clients/tmdb';
import { NotFoundError } from '../errors/NotFoundError';
import { FilmDetails } from '../types/film';
import { Prisma } from '../generated/prisma/client';
import { createFilm, findFilmByTmdbId } from '../repositories/filmRepository';
import { findRatingsByFilmId } from '../repositories/ratingRepository';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchFilms = async (query: string) => {
  const data = await searchMovies(query);

  return data.results;
};

export const getFilmDetails = async (tmdbId: number): Promise<FilmDetails> => {
  const movie = await getMovieDetails(tmdbId);

  if (!movie) {
    throw new NotFoundError('FILM_NOT_FOUND', 'Film not found');
  }

  return {
    tmdbId: movie.id,
    imdbId: movie.imdb_id,
    title: movie.title,
    tmdbRating: movie.vote_average,
    tmdbVotesCount: movie.vote_count,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    overview: movie.overview || null,
  };
};

export const findOrCreateFilmByTmdbId = async (tmdbId: number) => {
  const existing = await findFilmByTmdbId(tmdbId);

  if (existing) {
    return existing;
  }

  const details = await getFilmDetails(tmdbId);

  try {
    return await createFilm(details);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const film = await findFilmByTmdbId(tmdbId);

      if (!film) throw new NotFoundError('FILM_NOT_FOUND', 'Film not found');

      return film;
    }
    throw error;
  }
};

export const getRatingsByTmdbIdService = async (tmdbId: number) => {
  const film = await findFilmByTmdbId(tmdbId);
  if (!film) return [];

  return await findRatingsByFilmId(film.id);
};
