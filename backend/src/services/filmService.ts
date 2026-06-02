import { searchMovies, getMovieDetails } from '../clients/tmdb';
import { NotFoundError } from '../errors/NotFoundError';
import { FilmDetails } from '../types/film';

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
