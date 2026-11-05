// EU Blue Card minimum gross annual salary thresholds in EUR.
// TODO: Replace placeholders with official 2026 governmental thresholds.
export const BLUE_CARD_MIN_EUR = {
  DE: 45300, // Germany (TODO: official threshold)
  NL: 56000, // Netherlands (TODO: official threshold)
  FR: 53836, // France (TODO: official threshold)
  ES: 42000, // Spain (TODO: official threshold)
  IT: 38000, // Italy (TODO: official threshold)
  PL: 32000, // Poland (TODO: official threshold)
  AT: 54000, // Austria (TODO: official threshold)
  SE: 52000, // Sweden (TODO: official threshold)
  IE: 48000, // Ireland (TODO: official threshold)
  BE: 54000, // Belgium (TODO: official threshold)
  LU: 65000, // Luxembourg (TODO: official threshold)
  DEFAULT: 48000, // Fallback for other European states
};

export function isBlueCardEligible(countryCode, salaryMin) {
  if (!salaryMin || typeof salaryMin !== 'number' || isNaN(salaryMin)) return false;
  const iso = (countryCode || '').toUpperCase().trim();
  const threshold = BLUE_CARD_MIN_EUR[iso] ?? BLUE_CARD_MIN_EUR.DEFAULT;
  return salaryMin >= threshold;
}

