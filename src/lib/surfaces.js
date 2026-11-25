const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const isLocal =
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ||
  Boolean(env.DEV);

/**
 * Outbound surface bases — split deploys override via VITE_*_URL.
 * Public marketing (rightway.ai): never link Admin here.
 * Admin console: admin.rightway.ai (admin repo only).
 * Candidate: candidate.rightway.ai · Recruiter: recruiter.rightway.ai
 */
export const PUBLIC_URL = (env.VITE_PUBLIC_URL || '').replace(/\/$/, '') || '';
export const CANDIDATE_URL =
  (env.VITE_CANDIDATE_URL || '').replace(/\/$/, '') ||
  (isLocal ? 'http://localhost:3003' : 'https://candidate.rightway.ai');
export const RECRUITER_URL =
  (env.VITE_RECRUITER_URL || '').replace(/\/$/, '') ||
  (isLocal ? 'http://localhost:3005' : 'https://recruiter.rightway.ai');
export const ADMIN_URL =
  (env.VITE_ADMIN_URL || '').replace(/\/$/, '') ||
  (isLocal ? 'http://localhost:3006' : 'https://admin.rightway.ai');

function joinBase(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

/** Build candidate auth URL with optional post-auth redirect + vacancy deep-link. */
function candidateAuthPath(pathname, { vacancyId, next } = {}) {
  const params = new URLSearchParams();
  const safeNext =
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') && !next.includes('://')
      ? next
      : null;
  if (vacancyId) {
    params.set('vacancy', String(vacancyId));
    params.set('next', safeNext || `/portal/jobs?vacancy=${encodeURIComponent(String(vacancyId))}`);
  } else if (safeNext) {
    params.set('next', safeNext);
  }
  const qs = params.toString();
  return joinBase(CANDIDATE_URL, qs ? `${pathname}?${qs}` : pathname);
}

/** Apply CTA: logged-in candidate → portal job; guest → signup with vacancy. */
export function candidateApplyHref(vacancyId) {
  const id = vacancyId != null ? String(vacancyId) : '';
  if (
    typeof window !== 'undefined' &&
    localStorage.getItem('user_role') === 'CANDIDATE' &&
    id
  ) {
    return joinBase(CANDIDATE_URL, `/portal/jobs/${encodeURIComponent(id)}`);
  }
  return candidateAuthPath('/signup', { vacancyId: id || undefined });
}

export const surfaces = {
  publicHome: () => joinBase(PUBLIC_URL, '/'),
  publicEnquiry: (opts = {}) => {
    const role = String(opts.role || 'CANDIDATE').toUpperCase();
    const q = new URLSearchParams({ enquiry: '1', role });
    return `${joinBase(PUBLIC_URL, '/')}?${q.toString()}`;
  },
  publicPrivacy: () => joinBase(PUBLIC_URL, '/legal/gdpr-privacy'),
  publicTerms: () => joinBase(PUBLIC_URL, '/legal/terms'),
  candidateHome: () => joinBase(CANDIDATE_URL, '/portal'),
  candidateJob: (vacancyId) =>
    joinBase(CANDIDATE_URL, `/portal/jobs/${encodeURIComponent(String(vacancyId || ''))}`),
  candidateProfile: () => joinBase(CANDIDATE_URL, '/portal/profile'),
  candidateSettings: (tab = '') => joinBase(CANDIDATE_URL, `/portal/settings${tab ? `?tab=${tab}` : ''}`),
  candidateLogin: (opts) => candidateAuthPath('/login', opts),
  candidateRegister: (opts) => candidateAuthPath('/signup', opts),
  candidateApply: (vacancyId) => candidateApplyHref(vacancyId),
  candidateAts: () => joinBase(CANDIDATE_URL, '/ats-checker'),
  recruiterHome: () => joinBase(RECRUITER_URL, '/recruiter'),
  recruiterLogin: () => joinBase(RECRUITER_URL, '/login'),
  recruiterRegister: () => joinBase(RECRUITER_URL, '/signup'),
  /** Prefer admin.rightway.ai — do not surface on public marketing. */
  adminHome: () => joinBase(ADMIN_URL, '/admin'),
  adminLogin: () => joinBase(ADMIN_URL, '/login'),
};
