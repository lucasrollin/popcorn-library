import { type User, type PublicProfile } from '../types/user';
import { api } from './apiClient';

export type UpdateProfileInput = Partial<Pick<User, 'username' | 'avatar'>>;

export const getPublicProfile = (username: string) => {
  return api.get<PublicProfile>(`/users/${username}`);
};

export const updateMe = (data: UpdateProfileInput) => {
  return api.patch<User>('/users/me', data);
};

export const deleteMe = () => {
  return api.delete<void>('/users/me');
};
