const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'as', 'by', 'at',
  'is', 'are', 'be', 'this', 'that', 'from', 'we', 'you', 'your', 'our', 'their', 'will',
  'can', 'must', 'should', 'have', 'has', 'had', 'not', 'into', 'about', 'over', 'under',
  'job', 'role', 'team', 'work', 'working', 'experience', 'years', 'year', 'etc', 'via',
  'using', 'use', 'used', 'including', 'include', 'ability', 'strong', 'good', 'well',
  'need', 'needs', 'needed', 'looking', 'join', 'plus', 'also', 'across', 'within',
]);

export function extractJdKeywords(jobDescription = '', { limit = 40 } = {}) {
  const raw = String(jobDescription || '').toLowerCase();
  if (!raw.trim()) return [];

  const multi = [
    ...raw.matchAll(
      /\b(?:react(?:\.js)?|next\.js|node\.js|type\s*script|java\s*script|spring\s*boot|machine\s*learning|ci\/cd|rest\s*apis?|full[\s-]?stack|front[\s-]?end|back[\s-]?end|data\s*science|power\s*bi|unit\s*testing|system\s*design)\b/gi
    ),
  ].map((m) => m[0].replace(/\s+/g, ' ').trim().toLowerCase());

  const singles = raw
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && w.length <= 32 && !STOP.has(w) && !/^\d+$/.test(w));

  const counts = new Map();
  for (const w of [...multi, ...singles]) {
    counts.set(w, (counts.get(w) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);
}

export function scoreJdFit(cvText = '', jobDescription = '') {
  const jd = String(jobDescription || '').trim();
  if (!jd) {
    return {
      score: null,
      matched: [],
      missing: [],
      keywords: [],
      hasJobDescription: false,
    };
  }

  const keywords = extractJdKeywords(jd);
  const lower = String(cvText || '').toLowerCase();
  const matched = [];
  const missing = [];

  for (const k of keywords) {
    const re = new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (re.test(lower)) matched.push(k);
    else missing.push(k);
  }

  const score =
    keywords.length === 0 ? 0 : Math.round((matched.length / keywords.length) * 100);

  return {
    score,
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 20),
    keywords: keywords.slice(0, 40),
    hasJobDescription: true,
  };
}
