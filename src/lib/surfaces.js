const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

/** Outbound surface bases — split deploys override via VITE_*_URL. */
export const CANDIDATE_URL = (env.VITE_CANDIDATE_URL || '').replace(/\/$/, '') || '';
export const RECRUITER_URL = (env.VITE_RECRUITER_URL || '').replace(/\/$/, '') || '';
export const ADMIN_URL = (env.VITE_ADMIN_URL || '').replace(/\/$/, '') || '';

function joinBase(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

export const surfaces = {
  candidateHome: () => joinBase(CANDIDATE_URL, '/portal'),
  candidateLogin: () => joinBase(CANDIDATE_URL, '/auth/login?role=candidate'),
  candidateRegister: () => joinBase(CANDIDATE_URL, '/auth/register?role=candidate'),
  recruiterHome: () => joinBase(RECRUITER_URL, '/recruiter'),
  recruiterLogin: () => joinBase(RECRUITER_URL, '/auth/login?role=recruiter'),
  adminHome: () => joinBase(ADMIN_URL, '/admin'),
  adminLogin: () => joinBase(ADMIN_URL, '/auth/login?role=admin'),
};
