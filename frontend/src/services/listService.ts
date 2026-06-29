import { api } from './apiClient';
import type { List, ListWithFilmDetails, ListFilm, ListWithFilms } from '../types/list';

export const getMyLists = () => {
  return api.get<ListWithFilms[]>('/lists/me');
};

export const getList = (id: string) => {
  return api.get<ListWithFilmDetails>(`/lists/${id}`);
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

export const deleteList = (id: string) => {
  return api.delete<void>(`/lists/${id}`);
};

export const updateList = (
  id: string,
  data: { name: string; description: string | null; isPublic: boolean },
) => api.patch<List>(`/lists/${id}`, data);

export const getPublicLists = () => {
  return api.get<List[]>('/lists');
};
