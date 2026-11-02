export const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:3004';

export function authToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('access_token', token);
    else localStorage.removeItem('access_token');
  }
}

let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) {
        setAuthToken(null);
        throw new Error('Session expired');
      }
      const data = await res.json();
      setAuthToken(data.access_token);
      return data.access_token;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function api(path, init = {}) {
  const headers = new Headers(init.headers);
  const access = authToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  // Automatically refresh short-lived token if expired and retry once
  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    try {
      const newToken = await refreshAccessToken();
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
        credentials: 'include',
      });
    } catch {
      // Refresh failed, proceed with error
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const type = response.headers.get('content-type') ?? '';
  if (type.includes('pdf') || type.startsWith('image/') || type.includes('officedocument')) {
    return await response.blob();
  }
  return await response.json();
}
