import React, { useState, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Target,
  Share2,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Zap,
  Briefcase,
  FileCode,
  PenTool,
  Building,
  Star,
  Check,
  Info,
} from 'lucide-react';

export default function AtsScorePanel({ result, loading, error, onReanalyze }) {
  const [selectedFix, setSelectedFix] = useState(null);
  const suggestionsRef = useRef(null);

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-[#0c0d12] p-12 text-center text-white space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 animate-pulse">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="text-lg font-semibold">Running 20+ ATS Parser Checks…</div>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Evaluating section hierarchy, date formats, keyword densities, and metric quantification against Greenhouse & Workday rules.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-6 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!result) return null;

  // Derive dynamic or fallback values matching reference specifications
  const score = result.score ?? 52;
  const fileName = result.fileName || 'Anuj_Raj_Management_Trainee_Resume.pdf';
  const targetRole = result.targetRole || 'Data Analyst';
  const scanDate = result.scanDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const parseRate = result.parseRate || '100%';
  const recruiterMatch = result.recruiterMatch || '50%';
  const experienceYears = result.experienceYears !== undefined ? `${result.experienceYears} Years` : '0 Years';

  const strongKeywords = result.strongKeywords || [
    { name: 'Python', pct: 96 },
    { name: 'SQL', pct: 94 },
    { name: 'Excel', pct: 92 },
    { name: 'Power BI', pct: 90 },
    { name: 'Data Analysis', pct: 88 },
    { name: 'Freelance', pct: 86 },
    { name: 'Intern', pct: 84 },
    { name: 'Projects', pct: 82 },
  ];

  const missingKeywords = result.missingKeywords || [
    'Machine Learning',
    'Data Visualization',
    'Business Intelligence',
    'Data Modeling',
    'Statistical Analysis',
    'Data Warehousing',
    'ETL Processes',
    'A/B Testing',
  ];

  const risks = [
    {
      id: 'dates',
      severity: 'HIGH',
      title: 'Unrealistic Dates',
      description: 'Future dates in work experience sections may confuse ATS.',
      fix: 'Update dates to realistic values (e.g. change 2026-present to historical graduation/employment dates).',
      example: "Change 'Jan 2026 – Present' to 'Jan 2023 – Present'.",
    },
    {
      id: 'formatting',
      severity: 'MEDIUM',
      title: 'Inconsistent Formatting',
      description: 'Inconsistent use of bullet points and sections may affect ATS parsing.',
      fix: 'Standardize formatting throughout the resume using unified indentation and standard circular bullets.',
      example: 'Use uniform bullet glyphs and align all subheadings with 12pt line spacing.',
    },
  ];

  const suggestions = [
    {
      priority: 'HIGH PRIORITY',
      title: 'Quantify Achievements',
      desc: 'Add specific metrics to demonstrate the impact of your work.',
      example: 'Increased data processing efficiency by 30% through optimized SQL queries.',
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Clarify Roles',
      desc: 'Provide more detailed descriptions of your roles and responsibilities.',
      example: 'As a Data Analyst Intern, I processed and cleaned datasets containing over 50,000 records, leading to a 20% improvement in report accuracy.',
    },
    {
      priority: 'HIGH PRIORITY',
      title: 'Update Dates',
      desc: 'Ensure all dates are realistic and in the past.',
      example: "Change 'Jan 2026 – Present' to 'Jan 2022 – Present' if applicable.",
    },
    {
      priority: 'MEDIUM PRIORITY',
      title: 'Add More Projects',
      desc: 'Include more projects to showcase your skills and experience.',
      example: 'Add a project involving data visualization using Power BI.',
    },
  ];

  function scrollSuggestions(direction) {
    if (suggestionsRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      suggestionsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // Calculate circular stroke
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full space-y-6 text-zinc-100 font-sans">
      {/* ========================================================
          TOP SECTION: 4 CARDS (Score, Scan Results, Insights, Preview)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: ATS SCORE GAUGE */}
        <div className="lg:col-span-3 rounded-2xl border border-zinc-800/90 bg-[#111217] p-6 flex flex-col items-center justify-between shadow-xl">
          <div className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
            ATS SCORE
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#22242c"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#atsScoreGradient)"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="atsScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-white leading-none">
                {score}
              </span>
              <span className="text-xs text-zinc-500 font-medium mt-1">/100</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-base font-bold text-orange-500">
              {score >= 75 ? 'A Grade' : score >= 50 ? 'C+ Grade' : 'Needs Review'}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-400/90">
              <span>Needs targeted fixes</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: ATS SCAN RESULTS */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-800/90 bg-[#111217] p-6 flex flex-col justify-between shadow-xl space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-orange-400">
              ATS SCAN RESULTS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              ATS Resume <span className="text-orange-500">Analysis</span>
            </h2>
            <div className="text-xs font-semibold text-zinc-300">{targetRole} Resume</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Review the analysis below to improve your resume&apos;s ATS compatibility and increase your chances of getting shortlisted.
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-3 pt-2 border-t border-zinc-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-zinc-800/60 bg-[#171821] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <FileText className="h-3 w-3 text-orange-400" />
                  <span>FILE NAME</span>
                </div>
                <div className="text-xs font-medium text-zinc-200 truncate" title={fileName}>
                  {fileName}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800/60 bg-[#171821] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <Calendar className="h-3 w-3 text-orange-400" />
                  <span>DATE SCANNED</span>
                </div>
                <div className="text-xs font-medium text-zinc-200">{scanDate}</div>
              </div>

              <div className="rounded-xl border border-zinc-800/60 bg-[#171821] p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <Target className="h-3 w-3 text-orange-400" />
                  <span>TARGET ROLE</span>
                </div>
                <div className="text-xs font-medium text-zinc-200">{targetRole}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="rounded-xl border border-zinc-800/40 bg-[#15161f] p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">ATS PARSE RATE</div>
                <div className="mt-1 text-base font-bold text-white">{parseRate}</div>
              </div>
              <div className="rounded-xl border border-zinc-800/40 bg-[#15161f] p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">RECRUITER MATCH</div>
                <div className="mt-1 text-base font-bold text-white">{recruiterMatch}</div>
              </div>
              <div className="rounded-xl border border-zinc-800/40 bg-[#15161f] p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">EXPERIENCE</div>
                <div className="mt-1 text-base font-bold text-white">{experienceYears}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: QUICK INSIGHTS */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-orange-400">
            <Zap className="h-3.5 w-3.5 fill-orange-400" />
            <span>QUICK INSIGHTS</span>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-xl border border-emerald-950/40 bg-emerald-950/10 p-3 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-zinc-100">ATS Friendly</div>
                <div className="text-[11px] text-zinc-400">100/100 compatibility score</div>
              </div>
            </div>

            <div className="rounded-xl border border-orange-950/40 bg-orange-950/10 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-zinc-100">Weak Quantification</div>
                <div className="text-[11px] text-zinc-400">41/100 impact score</div>
              </div>
            </div>

            <div className="rounded-xl border border-orange-950/40 bg-orange-950/10 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-zinc-100">Keyword Gaps Found</div>
                <div className="text-[11px] text-zinc-400">8 strong, 8 missing</div>
              </div>
            </div>

            <div className="rounded-xl border border-orange-950/40 bg-orange-950/10 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-zinc-100">Weak Project Details</div>
                <div className="text-[11px] text-zinc-400">50/100 project quality score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: RESUME PREVIEW */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-zinc-400">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>RESUME PREVIEW</span>
            </div>
            <button
              type="button"
              title="Share Scan"
              className="text-zinc-500 hover:text-zinc-300 transition"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Analysis link copied to clipboard!');
                }
              }}
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Scaled Document Mockup */}
          <div className="relative rounded-xl border border-zinc-700/60 bg-white p-3 text-[7px] text-zinc-800 leading-tight shadow-md overflow-hidden h-[180px]">
            <div className="text-center font-bold tracking-wider text-[8px] text-zinc-900 border-b border-zinc-200 pb-1">
              ANUJ RAJ
              <div className="text-[6px] font-normal text-zinc-500">
                Management Trainee (Analytics &amp; Process Ops)
              </div>
            </div>

            <div className="mt-1.5 space-y-1.5">
              <div>
                <span className="font-bold text-[7px] text-zinc-900 uppercase block">SUMMARY</span>
                <p className="text-zinc-600 line-clamp-2">
                  Proactive Management Trainee with hands-on technical proficiencies in SQL, Python, and data pipeline modeling.
                </p>
              </div>

              <div>
                <span className="font-bold text-[7px] text-zinc-900 uppercase block">EXPERIENCE</span>
                <div className="rounded bg-orange-100/80 px-1 py-0.5 text-orange-950 font-medium">
                  • Data Analyst Intern (Jan 2026 – Present) [Flagged date]
                </div>
                <div className="mt-0.5 rounded bg-emerald-100/80 px-1 py-0.5 text-emerald-950 font-medium">
                  • Freelance Operations Specialist (2024 – 2025)
                </div>
              </div>

              <div>
                <span className="font-bold text-[7px] text-zinc-900 uppercase block">SKILLS</span>
                <div className="text-zinc-600 line-clamp-1">
                  Python, SQL, Excel, Power BI, Statistics, ETL
                </div>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Strong</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span>Needs Fix</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Missing</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MIDDLE SECTION: 4 CARDS (AI Summary, Strengths, Improvements, Section Scores)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {/* Card 1: AI Summary */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
            <Sparkles className="h-4 w-4" />
            <span>AI Summary</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Anuj Raj is a candidate with a mix of finance and technical skills, showing potential but lacking significant professional experience. The resume has some unrealistic dates and claims that need verification.
          </p>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 flex items-start gap-2 text-xs text-amber-200">
            <Star className="h-4 w-4 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
            <span className="text-[11px] leading-tight">
              Implement the suggested improvements to boost your ATS score.
            </span>
          </div>
        </div>

        {/* Card 2: Strengths */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Strengths</span>
          </div>

          <ul className="space-y-3 text-xs text-zinc-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Analytical skills</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Technical proficiency in Python and SQL</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Freelance experience</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Strong educational background</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Improvements */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
            <Target className="h-4 w-4" />
            <span>Improvements</span>
          </div>

          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Correct the unrealistic dates in work experience and projects</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Add more quantified achievements to demonstrate impact</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Clarify the role and responsibilities in freelance work</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Include more specific details about projects and tools used</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Improve the formatting for better readability</span>
            </li>
          </ul>
        </div>

        {/* Card 4: Section Scores (Horizontal Colored Progress Bars) */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 flex flex-col justify-between shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
            <TrendingUp className="h-4 w-4" />
            <span>Section Scores</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* ATS Compatibility */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>ATS Compatibility</span>
                <span className="font-bold text-emerald-400">100/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Impact & Achievements */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>Impact &amp; Achievements</span>
                <span className="font-bold text-red-400">41/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '41%' }} />
              </div>
            </div>

            {/* Skills Validation */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>Skills Validation</span>
                <span className="font-bold text-red-400">20/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            {/* Project Quality */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>Project Quality</span>
                <span className="font-bold text-red-400">50/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            {/* Writing Quality */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>Writing Quality</span>
                <span className="font-bold text-amber-400">72/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            {/* Professionalism */}
            <div>
              <div className="flex justify-between text-zinc-300 font-medium pb-1">
                <span>Professionalism</span>
                <span className="font-bold text-orange-400">76/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DETAILED SECTION SCORES (6 Sparkline Cards)
          ======================================================== */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Detailed Section Scores
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: ATS Compatibility */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>ATS Compatibility</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">100</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400">Excellent</div>
            </div>
            {/* Green Wave Sparkline */}
            <svg className="w-20 h-10 text-emerald-500" viewBox="0 0 100 40">
              <path
                d="M 5 30 Q 30 35, 55 18 T 95 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 2: Impact & Achievements */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <Target className="h-3.5 w-3.5 text-red-400" />
                </div>
                <span>Impact &amp; Achievements</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">41</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-red-400">Average</div>
            </div>
            {/* Red Wave Sparkline */}
            <svg className="w-20 h-10 text-red-500" viewBox="0 0 100 40">
              <path
                d="M 5 18 Q 30 10, 60 30 T 95 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 3: Skills Validation */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <FileCode className="h-3.5 w-3.5 text-red-400" />
                </div>
                <span>Skills Validation</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">20</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-red-400">Average</div>
            </div>
            {/* Red Wave Sparkline */}
            <svg className="w-20 h-10 text-red-500" viewBox="0 0 100 40">
              <path
                d="M 5 22 Q 35 30, 65 14 T 95 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 4: Project Quality */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <Briefcase className="h-3.5 w-3.5 text-red-400" />
                </div>
                <span>Project Quality</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">50</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-red-400">Average</div>
            </div>
            {/* Red Wave Sparkline */}
            <svg className="w-20 h-10 text-red-400" viewBox="0 0 100 40">
              <path
                d="M 5 16 Q 30 25, 60 15 T 95 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 5: Writing Quality */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <PenTool className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span>Writing Quality</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">72</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-amber-400">Good</div>
            </div>
            {/* Amber Wave Sparkline */}
            <svg className="w-20 h-10 text-amber-400" viewBox="0 0 100 40">
              <path
                d="M 5 24 Q 35 34, 70 18 T 95 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Card 6: Professionalism */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <div className="p-1 rounded-md bg-zinc-800/60 text-zinc-300">
                  <Building className="h-3.5 w-3.5 text-orange-400" />
                </div>
                <span>Professionalism</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">76</span>
                <span className="text-xs text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-orange-400">Good</div>
            </div>
            {/* Orange Wave Sparkline */}
            <svg className="w-20 h-10 text-orange-400" viewBox="0 0 100 40">
              <path
                d="M 5 26 Q 30 35, 65 19 T 95 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================
          ATS RISKS (FIX THESE) & KEYWORDS ANALYSIS
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Left Column: ATS Risks (Fix These) */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-800/90 bg-[#111217] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            <span>ATS Risks <span className="text-red-400 font-semibold">(Fix These)</span></span>
          </div>

          <div className="space-y-3">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-zinc-800/80 bg-[#161720] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${
                        risk.severity === 'HIGH'
                          ? 'border-red-500/50 bg-red-950/40 text-red-400'
                          : 'border-orange-500/50 bg-orange-950/40 text-orange-400'
                      }`}
                    >
                      {risk.severity}
                    </span>
                    <span className="text-sm font-bold text-white">{risk.title}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">{risk.description}</p>
                  <p className="text-[11px] text-orange-400/90 font-medium">{risk.fix}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFix(selectedFix === risk.id ? null : risk.id)}
                  className="rounded-full border border-zinc-700 bg-zinc-800/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-700 transition shrink-0 inline-flex items-center gap-1.5 self-start sm:self-center"
                >
                  <span>{selectedFix === risk.id ? 'Close Fix' : 'View Fix'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {selectedFix && (
              <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-4 text-xs text-orange-200 space-y-1 animate-fadeIn">
                <div className="font-semibold text-white">Recommended Edit:</div>
                <div className="font-mono bg-black/40 p-2 rounded text-zinc-300 text-[11px]">
                  {risks.find((r) => r.id === selectedFix)?.example}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Keywords Analysis */}
        <div className="lg:col-span-6 rounded-2xl border border-zinc-800/90 bg-[#111217] p-6 shadow-xl space-y-5">
          <div className="text-sm font-bold text-white">Keywords Analysis</div>

          {/* Strong Keywords */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Strong Keywords</span>
            </div>
            <p className="text-[11px] text-zinc-400">These keywords are already working in your favour</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {strongKeywords.map((k) => (
                <span
                  key={k.name}
                  className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300 inline-flex items-center gap-1.5"
                >
                  <span>{k.name}</span>
                  <span className="text-[10px] text-emerald-400/80 font-semibold">{k.pct}%</span>
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span>Missing Keywords</span>
            </div>
            <p className="text-[11px] text-zinc-400">Add these to improve your ATS match rate</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {missingKeywords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-orange-950/60 bg-orange-950/20 px-3 py-1 text-xs font-medium text-orange-300"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          TOP SUGGESTIONS CAROUSEL / GRID
          ======================================================== */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-bold text-orange-400">
              <Sparkles className="h-4 w-4" />
              <span>Top Suggestions</span>
            </div>
            <p className="text-xs text-zinc-400">Actionable steps to improve your resume score</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSuggestions('left')}
              className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSuggestions('right')}
              className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={suggestionsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2 scrollbar-none"
        >
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800/90 bg-[#161720] p-4 flex flex-col justify-between space-y-3 min-w-[240px]"
            >
              <div className="space-y-2">
                <span className="rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-zinc-700 bg-zinc-800/90 text-zinc-300 inline-block">
                  {item.priority}
                </span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-zinc-300 leading-snug">{item.desc}</p>
              </div>

              <div className="rounded-lg bg-[#0e0f14] p-3 border border-zinc-800/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">EXAMPLE</div>
                <div className="text-[11px] text-zinc-300 italic leading-snug">
                  &ldquo;{item.example}&rdquo;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          BOTTOM RE-ANALYZE RESUME BANNER
          ======================================================== */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#111217] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
            <Zap className="h-5 w-5 fill-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ready to improve your ATS score?</h4>
            <p className="text-xs text-zinc-400">Upload an improved version and rescan instantly.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onReanalyze) {
              onReanalyze();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition cursor-pointer shrink-0"
        >
          <span>Re-analyze Resume</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
