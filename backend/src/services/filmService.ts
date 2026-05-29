import { searchMovies } from '../clients/tmdb';

export const searchFilms = async (query: string) => {
  const data = await searchMovies(query);

  return data.results;
};
