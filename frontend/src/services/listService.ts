import { api } from './apiClient';
import type { List, ListFilm } from '../types/list';

export const getMyLists = () => {
  return api.get<List[]>('/lists/me');
};

export const addFilmToList = (listId: string, tmdbId: number) => {
  return api.post<ListFilm>(`/lists/${listId}/films`, { tmdbId });
};

export const createList = (name: string) => {
  return api.post<List>('/lists', { name });
};
