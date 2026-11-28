const STORAGE_KEY = 'rw_cookie_consent';

/** @typedef {{ essential: true, analytics: boolean, decidedAt: string }} CookieConsent */

export function readCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.essential !== true || typeof parsed.analytics !== 'boolean') return null;
    return /** @type {CookieConsent} */ (parsed);
  } catch {
    return null;
  }
}

/** @param {{ analytics: boolean }} choice */
export function writeCookieConsent({ analytics }) {
  /** @type {CookieConsent} */
  const value = {
    essential: true,
    analytics: Boolean(analytics),
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('rw-cookie-consent', { detail: value }));
  return value;
}

export function hasAnalyticsConsent() {
  return readCookieConsent()?.analytics === true;
}
