import { useAuthStore } from '../stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL;

// Miroir front des erreurs typées du backend : le serveur répond
// { error, message } + un statut HTTP, et on garde les trois jusqu'à l'appelant.
// Sans ça, un `new Error(message)` aplatit tout et une page ne peut plus
// distinguer « cette ressource n'existe pas » (404) d'une panne serveur (500).
export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    // Session died mid-navigation: drop the stale user so the UI (Nav, guards)
    // reflects logged-out state instead of lingering until a manual refresh.
    // Harmless on login/register 401s — user is already null there.
    if (res.status === 401) {
      useAuthStore.getState().clearUser();
    }

    const body = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      body?.error ?? 'UNKNOWN_ERROR',
      body?.message ?? `Request failed: ${res.status}`,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
