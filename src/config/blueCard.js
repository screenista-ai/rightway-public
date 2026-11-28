/**
 * EU Blue Card / comparable floors (gross EUR / year), as of 2026.
 * DE: Auswärtiges Amt / Make it in Germany 2026.
 * NL: IND European Blue Card monthly × 12 (excl. holiday pay).
 * Other ISO codes use DEFAULT — not claimed as country-official.
 */
export const BLUE_CARD_DE_GENERAL_EUR = 50700;
export const BLUE_CARD_DE_SHORTAGE_EUR = 45934; // shortage / STEM / recent grads / IT experience route

/** NL EU Blue Card standard (IND 2026: €5,942 / month). */
export const BLUE_CARD_NL_EUR = 5942 * 12; // 71304
/** NL reduced Blue Card (IND 2026: €4,754 / month). */
export const BLUE_CARD_NL_REDUCED_EUR = 4754 * 12; // 57048

/** Per-country floor used for job badges — lower eligible route where known. */
export const BLUE_CARD_MIN_EUR = {
  DE: BLUE_CARD_DE_SHORTAGE_EUR,
  NL: BLUE_CARD_NL_REDUCED_EUR,
  DEFAULT: BLUE_CARD_DE_SHORTAGE_EUR,
};

/** Blue Card is EU-only — never badge US/CA/AU/NZ or other non-EU markets. */
const BLUE_CARD_REGION = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

export function isBlueCardEligible(countryCode, salaryMin) {
  if (!salaryMin || typeof salaryMin !== 'number' || isNaN(salaryMin)) return false;
  const iso = (countryCode || '').toUpperCase().trim();
  if (!BLUE_CARD_REGION.has(iso)) return false;
  const threshold = BLUE_CARD_MIN_EUR[iso] ?? BLUE_CARD_MIN_EUR.DEFAULT;
  return salaryMin >= threshold;
}
