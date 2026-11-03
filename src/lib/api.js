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

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch (networkErr) {
    const err = new Error(toUserFriendlyMessage(networkErr.message, 0));
    err.code = 'NETWORK_ERROR';
    err.raw = networkErr.message;
    throw err;
  }

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
    const raw = await response.text();
    const friendlyMessage = toUserFriendlyMessage(raw, response.status);
    const err = new Error(friendlyMessage);
    err.status = response.status;
    err.raw = raw;
    throw err;
  }
  const type = response.headers.get('content-type') ?? '';
  if (type.includes('pdf') || type.startsWith('image/') || type.includes('officedocument')) {
    return await response.blob();
  }
  return await response.json();
}


export function toUserFriendlyMessage(raw, status = 0) {
  let message = '';
  let code = '';

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      message = parsed.error || parsed.message || '';
      code = parsed.code || '';
    } catch {
      if (raw.trim().startsWith('<') || raw.includes('<!DOCTYPE')) {
        message = '';
      } else {
        message = raw.trim();
      }
    }
  } else if (raw && typeof raw === 'object') {
    message = raw.error || raw.message || '';
    code = raw.code || '';
  }

  const CODE_MAP = {
    AUTH_INVALID_CREDS: 'Incorrect email or password. Please try again.',
    AUTH_USER_EXISTS: 'An account with this email already exists.',
    AUTH_RATE_LIMIT: 'Too many attempts. Please wait a few minutes before trying again.',
    SESSION_REVOKED: 'Your session has ended. Please sign in again.',
    SESSION_IDLE: 'You were signed out due to inactivity. Please sign in again.',
    TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
    PAYLOAD_TOO_LARGE: 'File is too large. Please choose a smaller file.',
    FORBIDDEN: "You don't have permission to perform this action.",
    NOT_FOUND: 'The requested item was not found.',
    NETWORK_ERROR: 'Unable to reach the server. Please check your internet connection.',
  };

  if (code && CODE_MAP[code]) return CODE_MAP[code];

  const lower = (message || '').toLowerCase();
  if (lower.includes('invalid credentials') || lower.includes('wrong password') || (lower.includes('password') && lower.includes('incorrect'))) {
    return 'Incorrect email or password. Please try again.';
  }
  if (lower.includes('already exists') || lower.includes('duplicate key') || lower.includes('unique constraint')) {
    return 'An account with this email already exists.';
  }
  if (lower.includes('rate limit') || lower.includes('too many login') || lower.includes('too many attempts') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a few moments and try again.';
  }
  if (lower.includes('session expired') || lower.includes('unauthorized') || lower.includes('jwt expired')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (lower.includes('file too large') || lower.includes('payload too large') || status === 413) {
    return 'File is too large. Please choose a smaller file.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('econnrefused')) {
    return 'Unable to reach the server. Please check your internet connection.';
  }

  if (status === 400 && message && message.length <= 90 && !/[{}_<>\/]/.test(message)) {
    return message;
  }
  if (status === 401) return 'Please sign in to continue.';
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return 'The requested resource was not found.';
  if (status === 413) return 'File is too large. Please choose a smaller file.';
  if (status === 429) return 'Too many attempts. Please wait a moment.';
  if (status >= 500) return 'Our system encountered an issue. Please try again shortly.';

  if (message && message.length <= 90 && !/[{}_<>\/]/.test(message)) {
    return message;
  }
  return 'Something went wrong. Please try again.';
}
