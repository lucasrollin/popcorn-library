import {
  searchMovies,
  getMovieDetails,
  type TmdbMovieDetails,
  type TmdbSearchMovie,
} from '../clients/tmdb.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { FilmDetails, FilmSearchResult } from '../types/film.js';
import { Prisma } from '../generated/prisma/client.js';
import { createFilm, findFilmByTmdbId } from '../repositories/filmRepository.js';
import { findRatingsByFilmId } from '../repositories/ratingRepository.js';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
// TMDB sometimes returns more than 50 actors; we keep the top billing
const CAST_LIMIT = 6;

export const mapMovieToSearchResult = (movie: TmdbSearchMovie): FilmSearchResult => {
  return {
    tmdbId: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    tmdbRating: movie.vote_average,
  };
};

export const searchFilms = async (query: string): Promise<FilmSearchResult[]> => {
  const data = await searchMovies(query);

  return data.results.map(mapMovieToSearchResult);
};

export const mapMovieToFilmDetails = (movie: TmdbMovieDetails): FilmDetails => {
  // crew is a flat array of EVERY role (photography, editing, music…),
  // the director is spotted through the job field
  const director = movie.credits.crew.find((member) => member.job === 'Director');

  return {
    tmdbId: movie.id,
    imdbId: movie.imdb_id,
    title: movie.title,
    tmdbRating: movie.vote_average,
    tmdbVotesCount: movie.vote_count,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    backdropUrl: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    overview: movie.overview || null,
    director: director?.name ?? null,
    // cast is already sorted by TMDB (credits order); we copy field by field
    // so the TMDB shape does not leak into our own contract
    cast: movie.credits.cast.slice(0, CAST_LIMIT).map((member) => ({
      name: member.name,
      character: member.character,
    })),
  };
};

export const getFilmDetails = async (tmdbId: number): Promise<FilmDetails> => {
  const movie = await getMovieDetails(tmdbId);

  if (!movie) {
    throw new NotFoundError('FILM_NOT_FOUND', 'Film not found');
  }

  return mapMovieToFilmDetails(movie);
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
