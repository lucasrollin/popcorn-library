import { api } from './apiClient';
import type { List, ListFilm, ListWithFilms } from '../types/list';

export const getMyLists = () => {
  return api.get<ListWithFilms[]>('/lists/me');
};

export const addFilmToList = (listId: string, tmdbId: number) => {
  return api.post<ListFilm>(`/lists/${listId}/films`, { tmdbId });
};

export const createList = (name: string) => {
  return api.post<List>('/lists', { name });
};

export const removeFilmFromList = (listId: string, tmdbId: number) => {
  return api.delete<void>(`/lists/${listId}/films/${tmdbId}`);
};
