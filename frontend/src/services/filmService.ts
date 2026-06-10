import { api } from './apiClient';
import type { FilmSearchResult } from '../types/film';

export const searchFilms = (query: string) => {
  return api.get<FilmSearchResult[]>(`/films/search?q=${encodeURIComponent(query)}`);
};
