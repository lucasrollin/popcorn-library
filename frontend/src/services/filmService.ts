import { api } from './apiClient';
import type { FilmDetails, FilmSearchResult } from '../types/film';

export const searchFilms = (query: string) => {
  return api.get<FilmSearchResult[]>(`/films/search?q=${encodeURIComponent(query)}`);
};

export const getFilm = (tmdbId: number) => {
  return api.get<FilmDetails>(`/films/${tmdbId}`);
};
