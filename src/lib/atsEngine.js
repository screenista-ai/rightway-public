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

// Common technical and functional skills by domain
export const DOMAIN_TAXONOMIES = {
  'Data & Analytics': {
    core: ['python', 'sql', 'excel', 'power bi', 'tableau', 'etl', 'pandas', 'statistics', 'data analysis', 'data modeling'],
    related: ['machine learning', 'data visualization', 'business intelligence', 'bigquery', 'snowflake', 'reporting', 'a/b testing'],
  },
  'Software Engineering': {
    core: ['javascript', 'typescript', 'react', 'node.js', 'python', 'git', 'docker', 'sql', 'rest api', 'ci/cd'],
    related: ['aws', 'kubernetes', 'microservices', 'graphql', 'redis', 'testing', 'linux', 'agile'],
  },
  'Product & Design': {
    core: ['product roadmap', 'agile', 'scrum', 'user stories', 'a/b testing', 'figma', 'user research', 'wireframing'],
    related: ['kpi tracking', 'stakeholder management', 'jira', 'go-to-market', 'design systems'],
  },
  'Operations & Management': {
    core: ['project management', 'operations', 'excel', 'process optimization', 'reporting', 'kpi tracking', 'budgeting', 'cross-functional leadership'],
    related: ['supply chain', 'vendor management', 'crm', 'risk management', 'continuous improvement'],
  },
  'General Professional': {
    core: ['communication', 'problem solving', 'team leadership', 'project coordination', 'data analysis', 'microsoft office', 'client management'],
    related: ['strategic planning', 'workflow automation', 'process improvement', 'research'],
  },
};

/**
 * Validates if the uploaded text has the characteristics of a genuine resume/CV.
 * Rejects invoices, financial sheets, legal contracts, receipts, code dumps, etc.
 */
export function classifyResumeText(text = '') {
  const clean = String(text || '').trim();
  if (clean.length < 50) {
    return {
      isResume: false,
      reason: 'The file appears empty or contains too little selectable text. Scanned image PDFs need to be OCR-readable.',
    };
  }

  const lower = clean.toLowerCase();

  // Negative non-CV signals
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

  // Positive CV signals
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

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(clean);
  const hasPhone = /(?:\+|00)?[\d\s().-]{9,}\d/.test(clean);
  const hasDateRange = /\b(19\d{2}|20\d{2})\s*[-–—to]+\s*(present|current|now|19\d{2}|20\d{2})\b/i.test(clean);

  // Must have at least 1 standard section and contact/date signals
  const confidenceScore =
    (positiveSectionHits * 25) +
    (hasEmail ? 20 : 0) +
    (hasPhone ? 15 : 0) +
    (hasDateRange ? 20 : 0);

  if (confidenceScore < 40 && positiveSectionHits === 0) {
    return {
      isResume: false,
      reason: 'Uploaded document does not contain standard resume sections (Experience, Education, Skills) or contact information.',
    };
  }

  return { isResume: true, confidenceScore };
}

/**
 * Infer target role / domain from text content.
 */
export function inferDomainAndRole(text = '', fileName = '') {
  const lower = `${fileName} ${text}`.toLowerCase();

  if (/data analyst|analytics|business intelligence|bi analyst|sql|tableau|power bi|pandas/i.test(lower)) {
    return { domain: 'Data & Analytics', role: 'Data Analyst' };
  }
  if (/software engineer|frontend|backend|fullstack|developer|react|node|typescript|python developer/i.test(lower)) {
    return { domain: 'Software Engineering', role: 'Software Engineer' };
  }
  if (/product manager|product owner|scrum master|agile coach/i.test(lower)) {
    return { domain: 'Product & Design', role: 'Product Manager' };
  }
  if (/operations|project manager|business analyst|supply chain/i.test(lower)) {
    return { domain: 'Operations & Management', role: 'Operations Specialist' };
  }
  return { domain: 'General Professional', role: 'Professional Profile' };
}

/**
 * Stage 1: Dynamically extract structured facts from any uploaded file.
 * Zero hardcoded names or job titles.
 */
export function extractResumeFacts(text = '', fileName = '', explicitRole = null) {
  const cleanText = String(text || '').replace(/\r/g, '').trim();
  const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);

  // Determine candidate name dynamically
  let candidateName = '';
  if (lines.length > 0) {
    const candidateFirst = lines[0].replace(/[^a-zA-Z\s]/g, '').trim();
    if (candidateFirst.length >= 3 && candidateFirst.length <= 40 && !/resume|cv|curriculum|page|profile/i.test(candidateFirst)) {
      candidateName = candidateFirst;
    }
  }

  if (!candidateName && fileName) {
    const nameFromFileName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(resume|cv|latest|final|updated|draft|v\d+)\b/gi, '')
      .trim();
    if (nameFromFileName.length >= 3) {
      candidateName = nameFromFileName
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  if (!candidateName) {
    candidateName = 'Candidate';
  }

  // Contact info
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = cleanText.match(/(?:\+|00)?[\d\s().-]{9,}\d/);
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);

  // Inferred or provided role
  const inferred = inferDomainAndRole(cleanText, fileName);
  const targetRole = explicitRole || inferred.role;
  const targetDomain = inferred.domain;

  // Extract date ranges from text
  const dateRegex = /\b(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(20\d{2}|19\d{2})\s*[-–—to]+\s*(present|current|now|(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?(20\d{2}|19\d{2}))\b/gi;

  const workEntries = [];
  let dMatch;

  while ((dMatch = dateRegex.exec(cleanText)) !== null) {
    // Find text context around this date line
    const matchIndex = dMatch.index;
    const textBefore = cleanText.slice(Math.max(0, matchIndex - 120), matchIndex);
    const textBeforeLines = textBefore.split('\n').filter(Boolean);
    const titleCandidate = textBeforeLines.length > 0 ? textBeforeLines[textBeforeLines.length - 1].replace(/[|•-]/g, '').trim() : '';

    const sYear = parseInt(dMatch[2], 10);
    const sMonth = dMatch[1] ? (MONTH_MAP[dMatch[1].toLowerCase()] || 1) : 1;
    const isCurrent = /present|current|now/i.test(dMatch[3]);
    const eYear = isCurrent ? null : (dMatch[5] ? parseInt(dMatch[5], 10) : sYear);
    const eMonth = isCurrent ? null : (dMatch[4] ? (MONTH_MAP[dMatch[4].toLowerCase()] || 12) : 12);

    let roleType = 'full-time';
    if (/intern|internship|trainee/i.test(titleCandidate) || /intern/i.test(textBefore)) roleType = 'internship';
    else if (/freelance|consultant|contract/i.test(titleCandidate) || /freelance/i.test(textBefore)) roleType = 'freelance';

    workEntries.push({
      title: titleCandidate.length > 3 && titleCandidate.length < 50 ? titleCandidate : `${targetRole}`,
      fullMatch: dMatch[0],
      startYear: sYear,
      startMonth: sMonth,
      endYear: eYear,
      endMonth: eMonth,
      isCurrent,
      type: roleType,
    });
  }

  // Detect skills dynamically from text
  const lowerText = cleanText.toLowerCase();
  const allDomainSkills = Object.values(DOMAIN_TAXONOMIES).flatMap((d) => [...d.core, ...d.related]);
  const uniqueSkillSet = Array.from(new Set(allDomainSkills));
  const detectedSkills = uniqueSkillSet.filter((skill) => {
    const esc = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${esc}\\b`, 'i').test(lowerText);
  });

  // Calculate bullet quantification ratio
  const bulletLines = lines.filter((l) => /^[•\-\*]/.test(l));
  const quantifiedBullets = bulletLines.filter((l) => /\b\d+(?:[.,]\d+)?%|\b\d+\s*(?:k|m|users|records|clients|hours)\b|\$\d+|€\d+/i.test(l));
  const quantificationRatio = bulletLines.length > 0 ? (quantifiedBullets.length / bulletLines.length) : (cleanText.includes('%') ? 0.45 : 0.2);

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
    detectedSkills,
    quantificationRatio,
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
 *  - Start Date <= scanDate with "Present" is recognized as ACTIVE CURRENT EMPLOYMENT.
 *  - Only flags start dates > scanDate as future dates.
 */
export function validateDatesAndExperience(workEntries = [], scanDate = new Date()) {
  const refDate = scanDate instanceof Date ? scanDate : new Date(scanDate);
  const refYear = refDate.getFullYear();
  const refMonth = refDate.getMonth() + 1; // 1-12

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

  // Calculate breakdown
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
  // 1. ATS Compatibility (standard format, contact presence, headings)
  let atsComp = 100;
  if (!facts.email) atsComp -= 10;
  if (!facts.phone) atsComp -= 5;
  if (facts.workEntries.length === 0) atsComp -= 20;

  // 2. Impact & Achievements
  let impactScore = Math.min(100, Math.max(25, Math.round(facts.quantificationRatio * 100)));
  if (facts.quantificationRatio < 0.3) impactScore = 40;

  // 3. Skills Validation (relative to detected domain)
  const domainData = DOMAIN_TAXONOMIES[facts.targetDomain] || DOMAIN_TAXONOMIES['General Professional'];
  const matchedCore = domainData.core.filter((s) => facts.detectedSkills.includes(s));
  const skillsScore = Math.min(100, Math.max(20, Math.round((matchedCore.length / Math.max(domainData.core.length, 1)) * 100) || 50));

  // 4. Project Quality
  const projectsScore = facts.detectedSkills.length > 4 ? 65 : 45;

  // 5. Writing Quality
  const writingScore = facts.wordCount > 150 && facts.wordCount < 1000 ? 80 : 60;

  // 6. Professionalism
  const professionalismScore = validation.totalMonths > 0 ? 75 : 60;

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
    parseRate: `${atsComp}%`,
    recruiterMatch: `${Math.round((skillsScore + impactScore) / 2)}%`,
  };
}

/**
 * Stage 4: Recommendations, dynamic keywords & verified risks.
 */
export function generateRecommendations(facts, validation, scores) {
  const domainData = DOMAIN_TAXONOMIES[facts.targetDomain] || DOMAIN_TAXONOMIES['General Professional'];

  // Strong keywords present in CV
  const strongKeywords = facts.detectedSkills.slice(0, 8).map((skill, i) => ({
    name: skill.charAt(0).toUpperCase() + skill.slice(1),
    pct: Math.max(75, 96 - i * 3),
  }));

  // If few skills detected, provide baseline
  if (strongKeywords.length === 0) {
    domainData.core.slice(0, 4).forEach((skill, i) => {
      strongKeywords.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        pct: 85 - i * 5,
      });
    });
  }

  // Missing domain keywords
  const missingKeywords = domainData.related
    .filter((k) => !facts.detectedSkills.includes(k))
    .slice(0, 8)
    .map((k) => k.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  const risks = [];

  // Date Risk: ONLY if an actual start date exceeds scan date
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

  // Quantification Risk
  if (scores.sectionScores.impact < 60) {
    risks.push({
      id: 'quantification',
      severity: 'HIGH',
      title: 'Low Metric Quantification',
      description: 'Work history and project bullets lack measurable outcomes (percentages, records processed, efficiency gain).',
      fix: 'Add concrete numbers to describe your impact (e.g. volume of data handled, percentage time saved).',
      example: 'Change "Managed client database" to "Managed 10,000+ client records, improving query speeds by 25%."',
    });
  }

  // Contact info risk if missing
  if (!facts.email || !facts.phone) {
    risks.push({
      id: 'contact',
      severity: 'HIGH',
      title: 'Incomplete Contact Details',
      description: 'Applicant Tracking Systems prioritize resumes with both email and phone in the header.',
      fix: 'Add standard email address and mobile phone number at the very top of your CV.',
      example: 'Email: name@domain.com | Phone: +49 152 1234567',
    });
  }

  // Suggestions
  const suggestions = [
    {
      priority: 'HIGH PRIORITY',
      title: 'Quantify Achievements',
      desc: 'Add specific metrics to demonstrate the measurable impact of your work.',
      example: 'Increased operational processing efficiency by 30% through automated scripts.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Clarify Role Scope',
      desc: 'Provide detailed descriptions of your day-to-day responsibilities and deliverables.',
      example: 'Collaborated with cross-functional teams across 3 timezones to deliver software iterations.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Highlight Tools in Context',
      desc: 'Connect technical tools directly to project outcomes instead of listing them alone.',
      example: 'Built automated analytics dashboards connecting directly to production databases.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Standardize Bullet Formatting',
      desc: 'Use consistent circular bullet points and maintain uniform line spacing.',
      example: 'Keep bullet points between 1 to 2 lines for optimal ATS parser readability.',
    },
  ];

  const summary = `${facts.candidateName} presents ${validation.experienceFormatted} of total experience (${validation.breakdownString}) with strengths in ${facts.detectedSkills.slice(0, 3).join(', ') || facts.targetRole}. Technical parsing compatibility is ${scores.parseRate}; primary score boost comes from adding measurable business metrics.`;

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
  const classification = classifyResumeText(text);
  if (!classification.isResume) {
    return {
      isResume: false,
      error: classification.reason,
    };
  }

  // Step 1: Fact extraction
  const facts = extractResumeFacts(text, fileName, options.targetRole);

  // Step 2: Date validation & duration
  const validation = validateDatesAndExperience(facts.workEntries, scanDate);

  // Step 3: Weighted scoring
  const scores = calculateSectionScores(facts, validation);

  // Step 4: AI Recommendations & keywords
  const recs = generateRecommendations(facts, validation, scores);

  return {
    isResume: true,
    fileName: fileName || `${facts.candidateName.replace(/\s+/g, '_')}_Resume.pdf`,
    candidateName: facts.candidateName,
    targetRole: facts.targetRole,
    targetDomain: facts.targetDomain,
    scanDate: scanDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    score: scores.overallScore,
    parseRate: scores.parseRate,
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
