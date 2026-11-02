export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function authToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const access = authToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const type = response.headers.get('content-type') ?? '';
  if (type.includes('pdf') || type.startsWith('image/') || type.includes('officedocument')) {
    return (await response.blob()) as T;
  }
  return (await response.json()) as T;
}
