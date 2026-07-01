import type { PublicProfile } from '../types/user';
import { api } from './apiClient';

export const getPublicProfile = (username: string) => {
  return api.get<PublicProfile>(`/users/${username}`);
};
