const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

/**
 * Outbound surface bases — split deploys override via VITE_*_URL.
 * Public marketing (rightway.ai): never link Admin here.
 * Admin console: admin.rightway.ai (admin repo only).
 * Candidate: candidate.rightway.ai · Recruiter: recruiter.rightway.ai
 */
export const CANDIDATE_URL =
  (env.VITE_CANDIDATE_URL || '').replace(/\/$/, '') || 'https://candidate.rightway.ai';
export const RECRUITER_URL =
  (env.VITE_RECRUITER_URL || '').replace(/\/$/, '') || 'https://recruiter.rightway.ai';
export const ADMIN_URL =
  (env.VITE_ADMIN_URL || '').replace(/\/$/, '') || 'https://admin.rightway.ai';

function joinBase(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

export const surfaces = {
  candidateHome: () => joinBase(CANDIDATE_URL, '/portal'),
  candidateLogin: () => joinBase(CANDIDATE_URL, '/auth/login?role=candidate'),
  candidateRegister: () => joinBase(CANDIDATE_URL, '/auth/register?role=candidate'),
  candidateAts: () => joinBase(CANDIDATE_URL, '/ats-checker'),
  recruiterHome: () => joinBase(RECRUITER_URL, '/recruiter'),
  recruiterLogin: () => joinBase(RECRUITER_URL, '/auth/login?role=recruiter'),
  recruiterRegister: () => joinBase(RECRUITER_URL, '/auth/register?role=recruiter'),
  /** Prefer admin.rightway.ai — do not surface on public marketing. */
  adminHome: () => joinBase(ADMIN_URL, '/admin'),
  adminLogin: () => joinBase(ADMIN_URL, '/auth/login?role=admin'),
};
