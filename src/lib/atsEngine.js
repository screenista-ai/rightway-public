/**
 * RightWay Dynamic ATS Resume Analysis Engine
 * - Strict CV / Resume Classifier (rejects invoices, receipts, legal docs, non-CVs)
 * - Dynamic Fact Extraction (no hardcoded candidate names, roles, or jobs)
 * - Reference Date Validation (current employment !== future date)
 * - Mathematically Weighted Section Scores (Overall Score = Exact Weighted Sum)
 * - Dynamic Preview & Factual AI Summary
 */

const MONTH_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

/** @deprecated Not used in score path — kept for legacy tests only. */
export const DOMAIN_TAXONOMIES = {
  'Backend Engineering': {
    core: ['java', 'python', 'rest apis', 'sql', 'dbms', 'fastapi', 'django', 'spring boot', 'oop', 'collections', 'crud', 'authentication', 'git', 'github'],
    related: ['docker', 'microservices', 'postgresql', 'redis', 'junit', 'ci/cd', 'aws', 'system design', 'kafka', 'unit testing'],
  },
  'Frontend Engineering': {
    core: ['javascript', 'typescript', 'react', 'html', 'css', 'tailwind', 'next.js', 'redux', 'git', 'rest apis'],
    related: ['jest', 'webpack', 'vite', 'responsive design', 'graphql', 'accessibility', 'ui/ux', 'ci/cd'],
  },
  'Full Stack Engineering': {
    core: ['javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb', 'sql', 'rest apis', 'git', 'html', 'css'],
    related: ['docker', 'aws', 'next.js', 'postgresql', 'redis', 'ci/cd', 'microservices', 'tailwind'],
  },
  'Cloud & DevOps': {
    core: ['aws', 'docker', 'kubernetes', 'ci/cd', 'git', 'linux', 'terraform', 'bash', 'cloud computing'],
    related: ['prometheus', 'grafana', 'ansible', 'microservices', 'python', 'security', 'networking'],
  },
  'Data & Analytics': {
    core: ['python', 'sql', 'pandas', 'numpy', 'power bi', 'tableau', 'excel', 'statistics', 'etl', 'data modeling'],
    related: ['machine learning', 'data visualization', 'bigquery', 'snowflake', 'reporting', 'a/b testing', 'spark'],
  },
  'Product & Design': {
    core: ['product roadmap', 'agile', 'scrum', 'user stories', 'figma', 'user research', 'wireframing', 'kpi tracking'],
    related: ['stakeholder management', 'jira', 'go-to-market', 'design systems', 'a/b testing'],
  },
  'General Professional': {
    core: ['communication', 'problem solving', 'team leadership', 'project management', 'microsoft office', 'reporting'],
    related: ['strategic planning', 'workflow automation', 'process improvement', 'research'],
  },
};

const STRONG_ACTION_VERBS = [
  'led', 'engineered', 'spearheaded', 'increased', 'optimized', 'reduced',
  'delivered', 'architected', 'automated', 'improved', 'scaled', 'generated',
  'streamlined', 'cut', 'accelerated', 'launched', 'managed', 'executed',
  'pioneered', 'transformed', 'negotiated', 'built', 'designed', 'orchestrated'
];

/**
 * Validates if the uploaded text has the characteristics of a genuine resume/CV.
 * Rejects invoices, financial sheets, legal contracts, receipts, code dumps, etc.
 */
export function classifyResumeText(text = '', fileName = '') {
  const clean = String(text || '').trim();
  if (clean.length < 50) {
    return {
      isResume: false,
      reason: 'The file appears empty or contains too little selectable text. Scanned image PDFs need to be OCR-readable.',
    };
  }

  const lower = clean.toLowerCase();
  const fileLower = String(fileName || '').toLowerCase();
  const combined = `${fileLower} ${lower}`;

  // 1. Identity & Government ID cards detection (Aadhaar, PAN, Passport, Driving License, Voter ID, etc.)
  const isIdDocument =
    /\b(aadhaar|adhaar|uidai|unique\s+identification\s+authority|resident\s+of\s+india|myaadhaar)\b/i.test(combined) ||
    /\b(government\s+of\s+india)\b/i.test(combined) ||
    /\b(pan\s*card|permanent\s+account\s+number|income\s+tax\s+department)\b/i.test(combined) ||
    /\b(driving\s*licen[sc]e|motor\s+vehicles\s+department)\b/i.test(combined) ||
    /\b(voter\s*id|election\s+commission|epic\s*no)\b/i.test(combined) ||
    /\b(passport\s*no|republic\s+of\s+india\s+passport)\b/i.test(combined) ||
    /\b(identity\s*card|national\s*id\s*card|citizen\s*id)\b/i.test(combined);

  if (isIdDocument) {
    return {
      isResume: false,
      reason: 'The uploaded file appears to be an identity card or government document (e.g. Aadhaar / PAN / ID Card), not a resume or CV. Please upload your professional CV or resume.',
    };
  }

  // 2. Negative non-CV signals (Invoices, legal agreements, receipts)
  const negativeKeywords = [
    'invoice #', 'bill to:', 'invoice date', 'tax return', 'receipt #',
    'purchase order', 'payment terms', 'subtotal:', 'vat id:', 'remittance advice',
    'terms and conditions apply', 'non-disclosure agreement', 'this agreement is entered into',
    'plaintiff', 'defendant', 'court of', 'chapter 1', 'table of contents'
  ];

  let negativeHits = 0;
  negativeKeywords.forEach((neg) => {
    if (lower.includes(neg)) negativeHits += 1;
  });

  if (negativeHits >= 2) {
    return {
      isResume: false,
      reason: 'This document appears to be an invoice, receipt, or legal agreement rather than a resume.',
    };
  }

  // 3. Positive CV signals
  const cvSectionPatterns = [
    /\b(experience|work history|employment|career)\b/i,
    /\b(education|academic|university|degree|bachelor|master|diploma)\b/i,
    /\b(skills|technical proficiencies|competencies|technologies)\b/i,
    /\b(projects|portfolio|achievements)\b/i,
    /\b(summary|profile|about me|objective)\b/i,
  ];

  let positiveSectionHits = 0;
  cvSectionPatterns.forEach((regex) => {
    if (regex.test(clean)) positiveSectionHits += 1;
  });

  // A genuine resume must contain at least 1 recognizable CV section
  if (positiveSectionHits === 0) {
    return {
      isResume: false,
      reason: 'Uploaded document does not contain standard resume sections (Experience, Education, Skills) or professional work history.',
    };
  }

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(clean);
  const hasPhone = /(?:\+|00)?[\d\s().-]{9,}\d/.test(clean);
  const hasDateRange = /\b(19\d{2}|20\d{2})\s*[-–—to]+\s*(present|current|now|19\d{2}|20\d{2})\b/i.test(clean);

  const confidenceScore =
    (positiveSectionHits * 25) +
    (hasEmail ? 20 : 0) +
    (hasPhone ? 15 : 0) +
    (hasDateRange ? 20 : 0);

  if (confidenceScore < 45) {
    return {
      isResume: false,
      reason: 'Uploaded document lacks essential CV components (work history, education, skills, or contact info). Please upload a standard resume.',
    };
  }

  return { isResume: true, confidenceScore };
}

/**
 * Dynamically extract target role and domain from resume content.
 * Checks headline, Objective, Summary, and weighted skill clusters.
 */
export function inferDomainAndRole(text = '', fileName = '', lines = []) {
  const clean = String(text || '');
  const lower = `${fileName} ${clean}`.toLowerCase();

  const ROLE_PATTERN = /\b((?:entry-level|junior|senior|associate|lead|principal|staff)?\s*(?:software engineer|technology platform engineer|backend developer|frontend developer|full[- ]stack developer|fullstack developer|java developer|python developer|cloud engineer|devops engineer|data engineer|data analyst|systems engineer|qa engineer|mobile developer|web developer|product manager|ui\/ux designer))\b/i;

  // 1. Check early headline lines (lines 1 to 4 directly under candidate name)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].replace(/^[•\-\*\s]+/, '').trim();
    if (ROLE_PATTERN.test(line) && line.length < 50) {
      const match = line.match(ROLE_PATTERN);
      if (match && match[1]) {
        const title = match[1].split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        return { domain: inferDomainFromTitle(title, lower), role: title };
      }
    }
  }

  // 2. Check Objective or Summary text
  const objectiveMatch = clean.match(/(?:objective|professional summary|summary|profile)[:\s]*([\s\S]*?)(?=(?:skills|education|experience|projects|certifications|$))/i);
  if (objectiveMatch && objectiveMatch[1]) {
    const objText = objectiveMatch[1].slice(0, 300);
    const m = objText.match(ROLE_PATTERN);
    if (m && m[1]) {
      const title = m[1].split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      return { domain: inferDomainFromTitle(title, lower), role: title };
    }
  }

  // 3. Dynamic domain clustering by weighted keyword frequency
  let backendScore = 0;
  let frontendScore = 0;
  let fullstackScore = 0;
  let dataScore = 0;
  let cloudScore = 0;

  const backendKws = ['java', 'python', 'fastapi', 'django', 'spring', 'rest api', 'dbms', 'sql', 'oop', 'collections', 'crud', 'microservices', 'c++'];
  const frontendKws = ['react', 'vue', 'angular', 'frontend', 'html', 'css', 'tailwind', 'next.js', 'typescript'];
  const dataKws = ['data analyst', 'data science', 'pandas', 'numpy', 'power bi', 'tableau', 'etl', 'machine learning', 'statistics'];
  const cloudKws = ['aws', 'docker', 'kubernetes', 'ci/cd', 'devops', 'linux', 'cloud', 'terraform'];

  const escReg = (k) => new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');

  backendKws.forEach((k) => { if (escReg(k).test(lower)) backendScore += 1; });
  frontendKws.forEach((k) => { if (escReg(k).test(lower)) frontendScore += 1; });
  dataKws.forEach((k) => { if (escReg(k).test(lower)) dataScore += 1.5; });
  cloudKws.forEach((k) => { if (escReg(k).test(lower)) cloudScore += 1; });

  if (/full[- ]stack|fullstack|mern|mean/i.test(lower) || (frontendScore >= 2 && backendScore >= 2)) {
    fullstackScore = Math.max(frontendScore, backendScore) + 2;
  }

  const max = Math.max(backendScore, frontendScore, fullstackScore, dataScore, cloudScore);

  if (max > 0) {
    if (max === fullstackScore) return { domain: 'Full Stack Engineering', role: 'Full Stack Developer' };
    if (max === backendScore) return { domain: 'Backend Engineering', role: 'Backend Developer' };
    if (max === frontendScore) return { domain: 'Frontend Engineering', role: 'Frontend Developer' };
    if (max === dataScore) return { domain: 'Data & Analytics', role: 'Data Analyst' };
    if (max === cloudScore) return { domain: 'Cloud & DevOps', role: 'Cloud / DevOps Engineer' };
  }

  return { domain: 'General Professional', role: 'Professional Profile' };
}

function inferDomainFromTitle(title = '', text = '') {
  const t = title.toLowerCase();
  if (/full[- ]stack|fullstack/i.test(t)) return 'Full Stack Engineering';
  if (/backend|java|python|system/i.test(t)) return 'Backend Engineering';
  if (/frontend|web|ui/i.test(t)) return 'Frontend Engineering';
  if (/cloud|devops|platform|infrastructure/i.test(t)) return 'Cloud & DevOps';
  if (/data|analytics|bi|machine learning/i.test(t)) return 'Data & Analytics';
  if (/product/i.test(t)) return 'Product & Design';
  // Display hint only — never used for score / missing keywords.
  return 'General Professional';
}

/**
 * Robust candidate-name detection avoiding job titles, headings, contacts, and metadata.
 */
export function detectCandidateName(lines = [], cleanText = '', fileName = '') {
  const NON_NAME_HEADINGS = /\b(resume|cv|curriculum\s+vitae|experience|education|skills|summary|profile|projects|contact|objective|work\s+history|certifications|languages|references|personal\s+details|employment)\b/i;
  const JOB_TITLES = /\b(engineer|developer|architect|designer|analyst|manager|specialist|consultant|director|administrator|coordinator|lead|officer|intern|trainee|programmer|scientist|student|graduate|assistant|associate|executive|accountant|technician)\b/i;
  const NON_NAME_METADATA = /\b(adhaar|aadhaar|pan\s*card|passport|driving\s*licence|license|government|id|identity|card|certificate|national|invoice|statement|page\s*\d|version|draft|final|updated|compressed|unnamed|scan|document)\b/i;

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    const line = rawLine.replace(/^[•\-\*\s]+/, '').trim();
    if (!line) continue;
    if (line.includes('@') || /(?:\+|00)?[\d\s().-]{8,}\d/.test(line) || /https?:\/\/|www\./i.test(line)) continue;
    if (NON_NAME_HEADINGS.test(line) || JOB_TITLES.test(line) || NON_NAME_METADATA.test(line)) continue;
    if (/[:;|/_]/.test(line)) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4) {
      const allAlphabetic = words.every((w) => /^[a-zA-Z'.-]+$/.test(w));
      if (allAlphabetic && line.length >= 4 && line.length <= 40) {
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  // Fallback to filename ONLY if genuine personal name format
  if (fileName) {
    const base = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(resume|cv|latest|final|updated|draft|v\d+|compressed|\(\d+\))\b/gi, '')
      .trim();
    if (base.length >= 4 && !NON_NAME_METADATA.test(base) && !JOB_TITLES.test(base) && !NON_NAME_HEADINGS.test(base)) {
      const words = base.split(/\s+/).filter(Boolean);
      if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[a-zA-Z'.-]+$/.test(w))) {
        return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  return 'Name not confidently detected';
}

const SECTION_HEADINGS_REGEX = /^(?:work\s+experience|professional\s+experience|employment\s+history|work\s+history|experience|career\s+history)\b/i;
const ALL_SECTION_HEADERS = /^(?:work\s+experience|professional\s+experience|employment\s+history|work\s+history|experience|education|academic\s+background|projects|key\s+projects|academic\s+projects|personal\s+projects|skills|technical\s+skills|trainings\s+or\s+certifications|certifications|trainings|summary|objective|professional\s+summary|interests|hobbies|activities|languages|awards)\b/i;

/**
 * Extracts employment records and date ranges ONLY from the Work Experience section.
 * Strictly ignores dates in Education, Projects, Certifications, or Header.
 */
export function extractWorkExperience(cleanText = '', lines = [], targetRole = 'Software Engineer') {
  let expStartIndex = -1;
  let expEndIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].replace(/^[•\-\*\s]+/, '').replace(/[:\-_]+$/, '').trim();
    if (SECTION_HEADINGS_REGEX.test(rawLine) && rawLine.length < 35) {
      expStartIndex = i + 1;
      break;
    }
  }

  // If no work experience section exists, return empty array immediately.
  // Never count Education, Certifications, or Projects as employment!
  if (expStartIndex === -1) {
    return { workEntries: [], hasExperienceSection: false };
  }

  // Find where Work Experience section ends
  for (let i = expStartIndex; i < lines.length; i++) {
    const rawLine = lines[i].replace(/^[•\-\*\s]+/, '').replace(/[:\-_]+$/, '').trim();
    if (ALL_SECTION_HEADERS.test(rawLine) && !SECTION_HEADINGS_REGEX.test(rawLine) && rawLine.length < 35) {
      expEndIndex = i;
      break;
    }
  }

  const expLines = lines.slice(expStartIndex, expEndIndex);
  const expText = expLines.join('\n');

  // Support English & EU formats:
  // Jan 2021 - Present | 01/2021 - 12/2023 | 01.2021 - 12.2023 | 2021 - 2024
  const dateRegex = /\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+|(\d{1,2})[./\\])?(20\d{2}|19\d{2})\s*[-–—to]+\s*(present|current|now|(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+|(\d{1,2})[./\\])?(20\d{2}|19\d{2}))\b/gi;

  const workEntries = [];
  let dMatch;

  while ((dMatch = dateRegex.exec(expText)) !== null) {
    const matchIndex = dMatch.index;
    const textBefore = expText.slice(Math.max(0, matchIndex - 140), matchIndex);
    const textBeforeLines = textBefore.split('\n').map((l) => l.trim()).filter(Boolean);

    let titleCandidate = '';
    let companyCandidate = '';

    if (textBeforeLines.length >= 1) {
      const lastLine = textBeforeLines[textBeforeLines.length - 1].replace(/^[•\-\*|]/, '').trim();
      if (lastLine.length >= 3 && lastLine.length <= 60) {
        titleCandidate = lastLine;
      }
    }
    if (textBeforeLines.length >= 2) {
      const secondLastLine = textBeforeLines[textBeforeLines.length - 2].replace(/^[•\-\*|]/, '').trim();
      if (secondLastLine.length >= 2 && secondLastLine.length <= 60 && !secondLastLine.includes('@')) {
        companyCandidate = secondLastLine;
      }
    }

    const sYear = parseInt(dMatch[3], 10);
    const sMonth = dMatch[1]
      ? (MONTH_MAP[dMatch[1].toLowerCase()] || 1)
      : (dMatch[2] ? parseInt(dMatch[2], 10) : 1);

    const isCurrent = /present|current|now/i.test(dMatch[4]);
    const eYear = isCurrent ? null : (dMatch[7] ? parseInt(dMatch[7], 10) : sYear);
    const eMonth = isCurrent
      ? null
      : (dMatch[5]
          ? (MONTH_MAP[dMatch[5].toLowerCase()] || 12)
          : (dMatch[6] ? parseInt(dMatch[6], 10) : 12));

    let roleType = 'full-time';
    const combinedContext = `${titleCandidate} ${companyCandidate} ${textBefore}`.toLowerCase();
    if (/intern|internship|trainee/i.test(combinedContext)) roleType = 'internship';
    else if (/freelance|consultant|contract/i.test(combinedContext)) roleType = 'freelance';

    workEntries.push({
      title: titleCandidate || targetRole,
      company: companyCandidate || null,
      fullMatch: dMatch[0],
      startYear: sYear,
      startMonth: Math.min(12, Math.max(1, sMonth)),
      endYear: eYear,
      endMonth: eMonth ? Math.min(12, Math.max(1, eMonth)) : null,
      isCurrent,
      type: roleType,
    });
  }

  return { workEntries, hasExperienceSection: true };
}

/**
 * Stage 1: Dynamically extract structured facts from any uploaded file.
 */
export function extractResumeFacts(text = '', fileName = '', explicitRole = null) {
  const cleanText = String(text || '').replace(/\r/g, '').trim();
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  const candidateName = detectCandidateName(lines, cleanText, fileName);

  // Contact info
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleanText.match(/(?:\+|00)?[\d\s().-]{9,}\d/);
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);

  // Inferred or provided role
  const inferred = inferDomainAndRole(cleanText, fileName, lines);
  const targetRole = explicitRole || inferred.role;
  const targetDomain = inferred.domain;

  // Extract work experience ONLY from the genuine Work Experience section
  const { workEntries, hasExperienceSection } = extractWorkExperience(cleanText, lines, targetRole);

  // Skills from Skills section only — no hardcoded domain taxonomy match.
  const lowerText = cleanText.toLowerCase();
  const detectedSkills = [];
  const skillsMatch = cleanText.match(/(?:technical skills|skills|technologies|proficiencies|competencies)[:\s]*([\s\S]*?)(?=(?:education|experience|work history|projects|certifications|trainings|interests|$))/i);
  if (skillsMatch && skillsMatch[1]) {
    const rawTokens = skillsMatch[1]
      .slice(0, 500)
      .replace(/[\(\)•\-\*\n\r]/g, ',')
      .split(/[,;|/]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length >= 2 && s.length <= 40 && !/^(and|or|with|in|including|etc|skills|technical)$/i.test(s));

    rawTokens.forEach((t) => {
      if (!detectedSkills.includes(t) && /^[a-zA-Z0-9#+.\s/-]+$/.test(t)) {
        detectedSkills.push(t);
      }
    });
  }
  const hasSkillsSection = Boolean(skillsMatch);

  // Calculate bullet quantification ratio
  const bulletLines = lines.filter((l) => /^[•\-\*]/.test(l));
  const quantifiedBullets = bulletLines.filter((l) => /\b\d+(?:[.,]\d+)?%|\b\d+\s*(?:k|m|users|records|clients|hours)\b|\$\d+|€\d+/i.test(l));
  const quantificationRatio = bulletLines.length > 0 ? (quantifiedBullets.length / bulletLines.length) : (cleanText.includes('%') ? 0.45 : 0.2);

  // Extract action verbs for impact analysis
  const foundActionVerbs = STRONG_ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(lowerText));

  // Project evidence
  const hasProjectsSection = /\b(projects|personal projects|key projects|academic projects|portfolio)\b/i.test(cleanText);
  const hasProjectLinks = /\b(github\.com|gitlab\.com|bitbucket\.org|behance\.net|dribbble\.com|vercel\.app|netlify\.app|heroku\.com)\b/i.test(cleanText) || /https?:\/\/[^\s]+/i.test(cleanText);
  const projectActionVerbs = /\b(built|architected|deployed|engineered|implemented|designed|created|integrated|spearheaded|developed)\b/gi;
  const projectActionCount = (cleanText.match(projectActionVerbs) || []).length;

  // Education presence
  const hasEducationSection = /\b(education|academic|university|degree|bachelor|master|diploma)\b/i.test(cleanText);

  // Formatting traps
  const pipeCount = (cleanText.match(/\|/g) || []).length;
  const tabTraps = (cleanText.match(/\t{2,}/g) || []).length;
  const hasDelimiterTraps = pipeCount > 15 || tabTraps > 5;

  // Pronoun check for professionalism
  const firstPersonCount = (cleanText.match(/\b(I|me|my|myself)\b/gi) || []).length;

  // Extract a factual summary snippet from the text
  let summarySnippet = '';
  const summaryMatch = cleanText.match(/(?:summary|profile|about me)[\s\S]{10,400}?(?=\n\s*(?:experience|education|skills|projects|$))/i);
  if (summaryMatch) {
    summarySnippet = summaryMatch[0].replace(/summary|profile|about me/gi, '').trim().slice(0, 220);
  }
  if (!summarySnippet && lines.length > 2) {
    summarySnippet = lines.slice(1, 4).join(' ').slice(0, 220);
  }

  return {
    candidateName,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin: linkedinMatch ? linkedinMatch[0] : null,
    targetRole,
    targetDomain,
    workEntries,
    hasExperienceSection,
    hasSkillsSection,
    detectedSkills,
    quantificationRatio,
    foundActionVerbs,
    hasProjectsSection,
    hasProjectLinks,
    projectActionCount,
    hasEducationSection,
    hasDelimiterTraps,
    firstPersonCount,
    summarySnippet,
    wordCount: wordsCount(cleanText),
    rawText: cleanText,
  };
}

function wordsCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Stage 2: Validate Dates relative to scanDate and calculate non-overlapping experience.
 * Strictly ignores any dates from Education, Certifications, or Projects.
 */
export function validateDatesAndExperience(workEntries = [], scanDate = new Date(), hasExperienceSection = true) {
  const refDate = scanDate instanceof Date ? scanDate : new Date(scanDate);
  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth() + 1; // 1-12

  if (!hasExperienceSection || workEntries.length === 0) {
    const isUnverified = hasExperienceSection && workEntries.length === 0;
    return {
      futureDateFound: false,
      futureDateTitle: '',
      totalMonths: 0,
      experienceFormatted: isUnverified ? 'Experience not confidently detected' : '0 Years',
      breakdownString: isUnverified
        ? 'Work experience listed without verifiable employment dates'
        : 'Entry level / Fresher (0 months verifiable employment)',
      hasCurrentRole: false,
    };
  }

  const intervals = [];
  let futureDateFound = false;
  let futureDateTitle = '';

  workEntries.forEach((entry) => {
    const sYear = entry.startYear;
    const sMonth = entry.startMonth || 1;
    const isStartInFuture = sYear > refYear || (sYear === refYear && sMonth > refMonth);

    if (isStartInFuture) {
      futureDateFound = true;
      futureDateTitle = `${entry.title} (${entry.fullMatch})`;
      return;
    }

    const startIndex = sYear * 12 + (sMonth - 1);
    let endIndex;

    if (entry.isCurrent) {
      endIndex = refYear * 12 + (refMonth - 1);
    } else {
      const eYear = entry.endYear || sYear;
      const eMonth = entry.endMonth || 12;
      endIndex = eYear * 12 + (eMonth - 1);
    }

    if (endIndex >= startIndex) {
      intervals.push({
        start: startIndex,
        end: endIndex,
        type: entry.type || 'full-time',
      });
    }
  });

  // Merge intervals to avoid double-counting overlapping positions
  intervals.sort((a, b) => a.start - b.start);
  const merged = [];
  intervals.forEach((interval) => {
    if (merged.length === 0) {
      merged.push({ ...interval });
    } else {
      const prev = merged[merged.length - 1];
      if (interval.start <= prev.end) {
        prev.end = Math.max(prev.end, interval.end);
      } else {
        merged.push({ ...interval });
      }
    }
  });

  let totalMonths = 0;
  merged.forEach((m) => {
    totalMonths += (m.end - m.start + 1);
  });

  let internshipMonths = 0;
  let freelanceMonths = 0;
  let fullTimeMonths = 0;

  workEntries.forEach((entry) => {
    if (entry.startYear > refYear) return;
    const sYear = entry.startYear;
    const sMonth = entry.startMonth || 1;
    const eYear = entry.isCurrent ? refYear : (entry.endYear || sYear);
    const eMonth = entry.isCurrent ? refMonth : (entry.endMonth || 12);
    const months = Math.max(1, (eYear - sYear) * 12 + (eMonth - sMonth) + 1);

    if (entry.type === 'internship') internshipMonths += months;
    else if (entry.type === 'freelance') freelanceMonths += months;
    else fullTimeMonths += months;
  });

  let experienceFormatted = '0 Years';
  if (totalMonths > 0) {
    const totalYears = (totalMonths / 12).toFixed(1);
    experienceFormatted = totalMonths >= 12 ? `${totalYears} Years` : `${totalMonths} Months`;
  }

  const breakdownParts = [];
  if (internshipMonths > 0) breakdownParts.push(`${internshipMonths} mos internship`);
  if (freelanceMonths > 0) breakdownParts.push(`${(freelanceMonths / 12).toFixed(1)} yrs freelance`);
  if (fullTimeMonths > 0) breakdownParts.push(`${(fullTimeMonths / 12).toFixed(1)} yrs full-time`);
  const breakdownString = breakdownParts.join(' + ') || (totalMonths > 0 ? `${totalMonths} months experience` : 'Entry level');

  return {
    futureDateFound,
    futureDateTitle,
    totalMonths,
    experienceFormatted,
    breakdownString,
    hasCurrentRole: workEntries.some((w) => w.isCurrent),
  };
}

/**
 * Stage 3: Section Scores & Mathematical Weighted Overall Score.
 */
export function calculateSectionScores(facts, validation) {
  // 1. ATS Compatibility (standard linear structure, headings, contact completeness, lack of delimiter traps)
  let atsComp = 100;
  if (!facts.email) atsComp -= 10;
  if (!facts.phone) atsComp -= 5;
  if (facts.workEntries.length === 0) atsComp -= 15;
  if (!facts.hasEducationSection) atsComp -= 15;
  if (facts.detectedSkills.length === 0) atsComp -= 10;
  if (facts.hasDelimiterTraps) atsComp -= 10;
  atsComp = Math.max(35, Math.min(100, atsComp));

  // 2. Impact & Achievements (quantified metrics 60% + action verbs 40%)
  const quantScore = Math.min(100, Math.round(facts.quantificationRatio * 100));
  const verbScore = Math.min(100, Math.round((facts.foundActionVerbs.length / 5) * 100));
  const impactScore = Math.max(25, Math.min(100, Math.round(quantScore * 0.6 + verbScore * 0.4)));

  // 3. Skills clarity (structure only — listed skills section, not domain taxonomy)
  let skillsScore = 40;
  if (facts.hasSkillsSection && facts.detectedSkills.length >= 8) skillsScore = 90;
  else if (facts.hasSkillsSection && facts.detectedSkills.length >= 4) skillsScore = 75;
  else if (facts.hasSkillsSection && facts.detectedSkills.length >= 1) skillsScore = 60;
  else if (facts.detectedSkills.length >= 3) skillsScore = 50;

  // 4. Project Quality (evaluates actual project evidence: section presence, links, action verbs)
  let projectsScore = 45;
  if (facts.hasProjectsSection && facts.hasProjectLinks && facts.projectActionCount >= 2) {
    projectsScore = 90;
  } else if (facts.hasProjectsSection && (facts.hasProjectLinks || facts.projectActionCount >= 2)) {
    projectsScore = 80;
  } else if (facts.hasProjectsSection) {
    projectsScore = 70;
  } else if (facts.hasProjectLinks || facts.projectActionCount >= 3) {
    projectsScore = 60;
  }

  // 5. Writing Quality (conciseness and word count)
  let writingScore = 75;
  if (facts.wordCount >= 250 && facts.wordCount <= 900) {
    writingScore = 85;
  } else if (facts.wordCount < 150 || facts.wordCount > 1200) {
    writingScore = 55;
  }

  // 6. Professionalism (tone, absence of first-person pronouns, professional contact info - NOT tenure)
  let professionalismScore = 85;
  if (facts.firstPersonCount > 3) professionalismScore -= 15;
  if (facts.linkedin) professionalismScore += 5;
  if (facts.wordCount < 150) professionalismScore -= 10;
  professionalismScore = Math.max(40, Math.min(100, professionalismScore));

  const weights = {
    atsCompatibility: 20,
    impact: 20,
    skills: 20,
    projects: 15,
    writing: 15,
    professionalism: 10,
  };

  const overallScore = Math.round(
    (atsComp * weights.atsCompatibility +
      impactScore * weights.impact +
      skillsScore * weights.skills +
      projectsScore * weights.projects +
      writingScore * weights.writing +
      professionalismScore * weights.professionalism) /
      100
  );

  // Text Extraction Quality (replaces misleading percentage with explicit verified status)
  const extractionStatus = facts.hasEducationSection && facts.workEntries.length > 0 && facts.wordCount >= 100
    ? 'Complete'
    : facts.wordCount >= 25
      ? 'Partial'
      : 'Unreadable';

  // Resume Strength (renamed from Recruiter Match - no job description claimed)
  const resumeStrength = `${Math.round(skillsScore * 0.4 + impactScore * 0.35 + projectsScore * 0.25)}%`;

  return {
    overallScore,
    sectionScores: {
      atsCompatibility: atsComp,
      impact: impactScore,
      skills: skillsScore,
      projects: projectsScore,
      writing: writingScore,
      professionalism: professionalismScore,
    },
    weights,
    extractionStatus,
    parseRate: extractionStatus,
    resumeStrength,
    recruiterMatch: resumeStrength,
  };
}

/**
 * Stage 4: Structure risks only. Skill gaps come from JD fit / AI suggest — not taxonomy.
 */
export function generateRecommendations(facts, validation, scores) {
  const strongKeywords = facts.detectedSkills.slice(0, 10).map((skill, i) => ({
    name: skill.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    pct: Math.max(70, 96 - i * 2),
  }));

  // No hardcoded missing skills without a JD.
  const missingKeywords = [];

  const risks = [];

  if (validation.futureDateFound) {
    risks.push({
      id: 'dates',
      severity: 'HIGH',
      title: 'Unrealistic Future Start Date',
      description: `${validation.futureDateTitle} is dated after the current scan date.`,
      fix: 'Correct the start year to match historical past employment or graduation.',
      example: 'Verify your employment timeline to ensure no start dates are in the future.',
    });
  }

  if (scores.sectionScores.impact < 60) {
    risks.push({
      id: 'quantification',
      severity: 'HIGH',
      title: 'Low Metric Quantification',
      description: 'Work history and project bullets lack measurable outcomes (numbers, %, volume).',
      fix: 'Add concrete numbers to describe your impact.',
      example: 'Change "Managed client database" to "Managed 10,000+ client records, improving query speeds by 25%."',
    });
  }

  if (!facts.email || !facts.phone) {
    risks.push({
      id: 'contact',
      severity: 'HIGH',
      title: 'Incomplete Contact Details',
      description: 'Parsers prioritize resumes with both email and phone in the header.',
      fix: 'Add email and phone at the top of your CV.',
      example: 'Email: name@domain.com | Phone: +49 152 1234567',
    });
  }

  if (!facts.hasSkillsSection) {
    risks.push({
      id: 'skills-section',
      severity: 'MEDIUM',
      title: 'No clear Skills section',
      description: 'A labeled Skills / Technologies block helps parsers index keywords.',
      fix: 'Add a Skills heading with a comma-separated list of tools and competencies.',
      example: 'Skills: Project management, Excel, stakeholder communication',
    });
  }

  const suggestions = [
    {
      priority: 'HIGH PRIORITY',
      title: 'Quantify Achievements',
      desc: 'Add numbers, volumes, or percentage gains to demonstrate impact.',
      example: 'Increased throughput by 30% through clearer process ownership.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Paste a job description',
      desc: 'Fit % and missing keywords need a target JD — not a hardcoded skill list.',
      example: 'Use the Job description box, then refresh JD fit or Get AI suggestions.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Standardize Bullet Formatting',
      desc: 'Use consistent bullet points and keep each to 1–2 lines.',
      example: 'Single-level bullets under Experience with plain text only.',
    },
  ];

  const displayName = facts.candidateName === 'Name not confidently detected' ? 'Candidate' : facts.candidateName;
  const skillBit = facts.detectedSkills.slice(0, 3).join(', ');
  const summary = `${displayName}: ${validation.experienceFormatted} experience (${validation.breakdownString}). Readability extraction is ${scores.extractionStatus}. ${
    skillBit ? `Skills listed: ${skillBit}. ` : ''
  }Paste a JD for fit %; use AI suggestions for role-specific tips.`;

  return {
    summary,
    strongKeywords,
    missingKeywords,
    risks,
    suggestions,
  };
}

/**
 * Complete Dynamic ATS Analysis Pipeline.
 */
export function analyzeResume(text = '', fileName = '', options = {}) {
  const scanDate = options.scanDate || new Date();

  // Step 0: Classify if CV or non-CV
  const classification = classifyResumeText(text, fileName);
  if (!classification.isResume) {
    return {
      isResume: false,
      error: classification.reason,
    };
  }

  // Step 1: Fact extraction
  const facts = extractResumeFacts(text, fileName, options.targetRole);

  // Step 2: Date validation & duration
  const validation = validateDatesAndExperience(facts.workEntries, scanDate, facts.hasExperienceSection);

  // Step 3: Weighted scoring
  const scores = calculateSectionScores(facts, validation);

  // Step 4: AI Recommendations & keywords
  const recs = generateRecommendations(facts, validation, scores);

  return {
    isResume: true,
    fileName: fileName || `${(facts.candidateName !== 'Name not confidently detected' ? facts.candidateName : 'Resume').replace(/\s+/g, '_')}.pdf`,
    candidateName: facts.candidateName,
    targetRole: facts.targetRole,
    targetDomain: facts.targetDomain,
    scanDate: scanDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    score: scores.overallScore,
    extractionStatus: scores.extractionStatus,
    parseRate: scores.extractionStatus,
    resumeStrength: scores.resumeStrength,
    recruiterMatch: scores.recruiterMatch,
    experienceFormatted: validation.experienceFormatted,
    experienceBreakdown: validation.breakdownString,
    totalMonths: validation.totalMonths,
    sectionScores: scores.sectionScores,
    weights: scores.weights,
    summary: recs.summary,
    strongKeywords: recs.strongKeywords,
    missingKeywords: recs.missingKeywords,
    risks: recs.risks,
    suggestions: recs.suggestions,
    facts,
    validation,
  };
}
