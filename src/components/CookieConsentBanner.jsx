import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readCookieConsent, writeCookieConsent } from '../lib/cookieConsent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!readCookieConsent());
  }, []);

  function decide(analytics) {
    writeCookieConsent({ analytics });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-4 sm:p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]">
        <p className="text-sm font-semibold text-[var(--rw-ink)]">Cookies on RightWay</p>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
          Essential cookies keep sign-in and security working. Analytics cookies (optional) help us
          understand product use. We do not use advertising trackers. Details in{' '}
          <Link to="/legal/gdpr-privacy" className="underline underline-offset-2 text-[var(--rw-ink)]">
            Privacy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--rw-line)] px-4 text-xs font-semibold text-[var(--rw-ink)] hover:bg-[var(--rw-paper-deep)] cursor-pointer"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--rw-accent)] px-4 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
