import { useAuthStore } from '../stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL;

// Front-end mirror of the backend's typed errors: the server answers with
// { error, message } plus an HTTP status, and all three survive up to the
// caller. Without this, a plain `new Error(message)` flattens everything and a
// page can no longer tell "this resource does not exist" (404) from a server
// failure (500).
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
