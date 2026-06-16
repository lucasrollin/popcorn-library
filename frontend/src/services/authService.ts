import { api } from './apiClient';
import type { User } from '../types/user';

export const login = (credentials: { email: string; password: string }) =>
  api.post<User>('/auth/login', credentials);

export const getMe = () => api.get<User>('/auth/me');

export const register = (data: { email: string; username: string; password: string }) =>
  api.post<User>('/auth/register', data);

export const logout = () => api.post<void>('/auth/logout', {});
