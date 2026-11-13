import { API_URL } from './api.js';
import { surfaces } from './surfaces.js';

export async function fetchPublicPlans(audience) {
  const key = String(audience || '').toUpperCase();
  const res = await fetch(`${API_URL}/public/plans?audience=${key}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to load plans');
  }
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

export function formatEuro(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return '€0';
  return `€${Math.round(n)}`;
}

export function planToTier(plan, { billingCycle = 'monthly', audience = 'CANDIDATE' } = {}) {
  const free = !(Number(plan.priceMonthly) > 0 || Number(plan.priceYearly) > 0);
  const code = String(plan.code || '').toUpperCase();
  const isRecruiter = audience === 'RECRUITER';
  const popular = code === 'PRO';
  let ctaText = 'Get Started';
  let ctaHref = isRecruiter ? surfaces.recruiterLogin() : surfaces.candidateRegister();
  let isEnquiry = false;

  if (isRecruiter) {
    if (code === 'FREE') ctaText = 'Open Recruiter Account';
    else if (code === 'PRO') ctaText = 'Start Recruiter Trial';
    else if (code === 'ELITE') {
      ctaText = 'Talk to Sales';
      isEnquiry = true;
      ctaHref = '#';
    } else ctaText = 'Open Recruiter Account';
  } else if (code === 'PRO') ctaText = 'Start 7-Day Free Trial';
  else if (code === 'ELITE') ctaText = 'Upgrade to Elite';

  return {
    id: plan.id || `${audience}-${code}`,
    code,
    category: plan.category || code,
    name: plan.name,
    tagline: plan.tagline || '',
    price: free
      ? '€0'
      : formatEuro(billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly),
    period: free ? '/ forever' : '/ month',
    features: plan.featureLabels || [],
    ctaText,
    ctaHref,
    isEnquiry,
    popular,
  };
}
