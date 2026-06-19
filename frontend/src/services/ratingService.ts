import { api } from './apiClient';
import type { Rating } from '../types/ratings';

export const createRating = (tmdbId: number, score: number) => {
  return api.post<Rating>('/ratings', { tmdbId, score });
};

export const updateRating = (id: string, score: number) => {
  return api.patch<Rating>(`/ratings/${id}`, { score });
};

export const deleteRating = (id: string) => {
  return api.delete<void>(`/ratings/${id}`);
};
