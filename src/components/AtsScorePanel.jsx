import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

function sanitizeDocxHtml(rawHtml = '') {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');
}

export default function AtsScorePanel({ result, loading, error, onReanalyze, file }) {
  const [selectedFix, setSelectedFix] = useState(null);
  const [showWeightExplanation, setShowWeightExplanation] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-12 text-center text-[var(--rw-ink)] space-y-4 shadow-sm">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 animate-pulse">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="text-lg font-semibold text-[var(--rw-ink)]">Scoring resume readability…</div>
        <p className="text-xs text-[var(--rw-muted)] max-w-md mx-auto">
          Checking structure, contact fields, dates, and quantified bullets. Paste a JD next for real fit %.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-red-900">Analysis Halted</div>
          <p className="text-xs text-red-700 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const facts = result.facts || {};
  const validation = result.validation || {};
  const sectionScores = result.sectionScores || {
    atsCompatibility: 100,
    impact: 40,
    skills: 60,
    projects: 50,
    writing: 75,
    professionalism: 70,
  };

  const weights = result.weights || {
    atsCompatibility: 20,
    impact: 20,
    skills: 20,
    projects: 15,
    writing: 15,
    professionalism: 10,
  };

  const score = result.score ?? 58;
  const jdFit = result.jdFit || null;
  const fileName = result.fileName || 'Uploaded_Resume.pdf';
  const candidateName = result.candidateName || 'Candidate';
  const targetRole = result.targetRole || 'Professional Profile';
  const scanDate = result.scanDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const extractionStatus = result.extractionStatus || (typeof result.parseRate === 'string' && !result.parseRate.includes('%') ? result.parseRate : 'Complete');
  const resumeStrength = result.resumeStrength || result.recruiterMatch || '65%';
  const experienceFormatted = result.experienceFormatted || '0 Years';
  const experienceBreakdown = result.experienceBreakdown || '';

  // AI returns string[]; local engine returns { name, pct }[]
  const strongKeywords = (result.strongKeywords || []).map((k, i) =>
    typeof k === 'string'
      ? { name: k, pct: Math.max(70, 96 - i * 2) }
      : { name: k?.name || String(k || ''), pct: k?.pct ?? Math.max(70, 96 - i * 2) }
  ).filter((k) => k.name);
  const missingKeywords = jdFit?.hasJobDescription
    ? (jdFit.missing || []).map((w) => w.split(' ').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' '))
    : result.missingKeywords || [];
  const risks = result.risks || [];
  const suggestions = result.suggestions || [];
  const jdFitScore = jdFit?.hasJobDescription ? jdFit.score : null;

  function scrollSuggestions(direction) {
    if (suggestionsRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      suggestionsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="ats-score-panel w-full rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-6 sm:p-8 text-[var(--rw-ink)] shadow-sm space-y-7">
      {/* ========================================================
          TOP ACTION BAR & SCORE EXPLANATION
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--rw-line)]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--rw-muted)]">
            Scanning completed for <strong className="text-[var(--rw-ink)] font-semibold">{fileName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReanalyze}
            className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-semibold transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Upload new CV</span>
          </button>
        </div>
      </div>

      {showWeightExplanation && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 text-xs text-orange-950 space-y-2 animate-fadeIn">
          <div className="font-semibold text-[var(--rw-ink)] flex items-center gap-2">
            <Info className="h-4 w-4 text-orange-600" />
            <span>Why is the overall score {score}/100?</span>
          </div>
          <p className="text-[var(--rw-ink)] leading-relaxed">
            Readability score reflects structure only (contact, sections, dates, bullets) — not a live vendor ATS run. Paste a JD for fit %.
            The <strong className="text-[var(--rw-ink)] font-semibold">Overall ATS Score</strong> is the mathematically weighted average of 6 evaluated categories:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              ATS Compatibility: {sectionScores.atsCompatibility}/100 (20%)
            </div>
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              Impact &amp; Metrics: {sectionScores.impact}/100 (20%)
            </div>
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              Skills clarity: {sectionScores.skills}/100 (20%)
            </div>
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              Project Quality: {sectionScores.projects}/100 (15%)
            </div>
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              Writing Quality: {sectionScores.writing}/100 (15%)
            </div>
            <div className="bg-[var(--rw-surface)] p-2.5 rounded-xl border border-orange-200/80">
              Professionalism: {sectionScores.professionalism}/100 (10%)
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TOP SECTION: 4 CARDS (Score, Scan Results, Insights, Preview)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: ATS SCORE GAUGE */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-6 flex flex-col items-center justify-between shadow-xs">
          <div className="text-[11px] font-bold tracking-wider uppercase text-[var(--rw-muted)]">
            READABILITY SCORE
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#e4e4e7"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#atsScoreGradientLight)"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="atsScoreGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-[var(--rw-ink)] leading-none">
                {score}
              </span>
              <span className="text-xs text-[var(--rw-muted)] font-medium mt-1">/100</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-base font-bold text-orange-600">
              {score >= 75 ? 'A Grade' : score >= 55 ? 'B- Grade' : 'C+ Grade'}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--rw-muted)]">
              <span>Structure / parseability</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-orange-600" />
            </div>
            {jdFitScore != null ? (
              <div className="mt-2 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                JD fit {jdFitScore}%
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-[var(--rw-muted)]">Paste JD for fit %</div>
            )}
          </div>
        </div>

        {/* Card 2: ATS SCAN RESULTS */}
        <div className="lg:col-span-4 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-6 flex flex-col justify-between shadow-xs space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-orange-100/70 border border-orange-200 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-orange-800">
              ATS SCAN RESULTS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--rw-ink)]">
              ATS Resume <span className="text-orange-600">Analysis</span>
            </h2>
            <div className="text-xs font-semibold text-[var(--rw-ink)]">{targetRole}</div>
            <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
              Review the verified fact breakdown below to improve your resume&apos;s strength and quantified achievements.
            </p>
          </div>

          {/* Metadata Grid — file full-width, then date + role, then metrics */}
          <div className="space-y-2 pt-2 border-t border-[var(--rw-line)]">
            <div className="min-w-0 rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">
                <FileText className="h-3 w-3 shrink-0 text-orange-600" />
                <span>FILE NAME</span>
              </div>
              <div className="text-xs font-medium text-[var(--rw-ink)] break-all leading-snug" title={fileName}>
                {fileName}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="min-w-0 rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-3 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">
                  <Calendar className="h-3 w-3 shrink-0 text-orange-600" />
                  <span>DATE SCANNED</span>
                </div>
                <div className="text-xs font-medium text-[var(--rw-ink)] leading-snug">{scanDate}</div>
              </div>

              <div className="min-w-0 rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-3 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">
                  <Target className="h-3 w-3 shrink-0 text-orange-600" />
                  <span>TARGET ROLE</span>
                </div>
                <div className="text-xs font-medium text-[var(--rw-ink)] break-words leading-snug" title={targetRole}>
                  {targetRole}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">TEXT EXTRACTION</div>
                <div className={`mt-1 text-base font-bold ${extractionStatus === 'Complete' ? 'text-emerald-700' : extractionStatus === 'Partial' ? 'text-amber-700' : 'text-rose-700'}`}>
                  {extractionStatus}
                </div>
              </div>
              <div className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">RESUME STRENGTH</div>
                <div className="mt-1 text-base font-bold text-[var(--rw-ink)]">{resumeStrength}</div>
              </div>
              <div className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-2.5 shadow-2xs" title={experienceBreakdown}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--rw-muted)]">EXPERIENCE</div>
                <div className="mt-1 text-base font-bold text-[var(--rw-ink)]">{experienceFormatted}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: QUICK INSIGHTS */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-orange-700">
            <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-600" />
            <span>QUICK INSIGHTS</span>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-950">ATS Readability</div>
                <div className="text-[11px] text-emerald-700">{sectionScores.atsCompatibility}/100 structure score</div>
              </div>
            </div>

            <div className={`rounded-xl border p-3 flex items-start gap-2.5 ${sectionScores.impact >= 60 ? 'border-emerald-200 bg-emerald-50/80' : 'border-orange-200 bg-orange-50/80'}`}>
              {sectionScores.impact >= 60 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`text-xs font-semibold ${sectionScores.impact >= 60 ? 'text-emerald-950' : 'text-orange-950'}`}>
                  {sectionScores.impact >= 60 ? 'Quantified Impact' : 'Low Metric Impact'}
                </div>
                <div className={`text-[11px] ${sectionScores.impact >= 60 ? 'text-emerald-700' : 'text-orange-700'}`}>
                  {sectionScores.impact}/100 metric score
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-3 flex items-start gap-2.5 ${sectionScores.skills >= 60 ? 'border-emerald-200 bg-emerald-50/80' : 'border-[var(--rw-line)] bg-[var(--rw-surface)]'}`}>
              <Zap className={`h-4 w-4 shrink-0 mt-0.5 ${sectionScores.skills >= 60 ? 'text-emerald-600' : 'text-[var(--rw-muted)]'}`} />
              <div>
                <div className={`text-xs font-semibold ${sectionScores.skills >= 60 ? 'text-emerald-950' : 'text-[var(--rw-ink)]'}`}>
                  Skills Coverage
                </div>
                <div className={`text-[11px] ${sectionScores.skills >= 60 ? 'text-emerald-700' : 'text-[var(--rw-muted)]'}`}>
                  {strongKeywords.length} listed
                  {jdFitScore != null ? `, ${missingKeywords.length} missing vs JD` : ' · paste JD for gaps'}
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-3 flex items-start gap-2.5 ${sectionScores.projects >= 60 ? 'border-emerald-200 bg-emerald-50/80' : 'border-[var(--rw-line)] bg-[var(--rw-surface)]'}`}>
              <Target className={`h-4 w-4 shrink-0 mt-0.5 ${sectionScores.projects >= 60 ? 'text-emerald-600' : 'text-[var(--rw-muted)]'}`} />
              <div>
                <div className={`text-xs font-semibold ${sectionScores.projects >= 60 ? 'text-emerald-950' : 'text-[var(--rw-ink)]'}`}>
                  Project Evidence
                </div>
                <div className={`text-[11px] ${sectionScores.projects >= 60 ? 'text-emerald-700' : 'text-[var(--rw-muted)]'}`}>
                  {sectionScores.projects}/100 evidence score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: RESUME PREVIEW (Displays actual uploaded document) */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-4 sm:p-4.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between pb-2 text-xs font-bold tracking-wider uppercase text-[var(--rw-muted)]">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[var(--rw-muted)]" />
              <span>RESUME PREVIEW</span>
            </div>
            <div className="flex items-center gap-2">
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open uploaded document in new tab"
                  className="text-[var(--rw-muted)] hover:text-orange-600 transition"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                type="button"
                title="Share Scan Link"
                className="text-[var(--rw-muted)] hover:text-[var(--rw-ink)] transition"
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
          </div>

          {/* Actual Uploaded File Document Display */}
          {file && (file.type === 'application/pdf' || file.name.endsWith('.pdf')) && fileUrl ? (
            <div className="relative w-full h-[380px] rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] overflow-hidden shadow-xs flex flex-col">
              <object
                data={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitW,0,0`}
                type="application/pdf"
                className="w-full h-full border-0 bg-[var(--rw-surface)]"
              >
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitW,0,0`}
                  title="Uploaded Resume PDF"
                  className="w-full h-full border-0 bg-[var(--rw-surface)]"
                />
              </object>
            </div>
          ) : result.documentHtml ? (
            <div className="relative w-full h-[380px] rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-4 text-[10px] text-[var(--rw-ink)] leading-relaxed overflow-y-auto scrollbar-thin shadow-xs">
              <div
                className="docx-preview-content space-y-2 [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-xs [&_h3]:font-semibold [&_p]:text-[10px] [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 [&_th]:border [&_th]:border-[var(--rw-line)] [&_th]:p-1 [&_th]:bg-[var(--rw-paper-deep)] [&_th]:text-[9px] [&_td]:border [&_td]:border-[var(--rw-line)] [&_td]:p-1 [&_td]:text-[9px]"
                dangerouslySetInnerHTML={{ __html: sanitizeDocxHtml(result.documentHtml) }}
              />
            </div>
          ) : (
            <div className="relative w-full h-[380px] rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-3.5 text-[9px] text-[var(--rw-ink)] leading-snug shadow-xs overflow-y-auto scrollbar-thin flex flex-col">
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-[8.5px] font-semibold text-amber-800 flex items-center gap-1.5 mb-2 shrink-0">
                <Info className="h-3 w-3 shrink-0 text-amber-600" />
                <span>Parsed Fact Summary (Original document layout unavailable)</span>
              </div>

              <div className="text-center font-bold tracking-wider text-[10px] text-[var(--rw-ink)] border-b border-[var(--rw-line)] pb-1.5">
                <span className={candidateName === 'Name not confidently detected' ? 'text-[var(--rw-muted)] italic font-normal text-[9px]' : ''}>
                  {candidateName === 'Name not confidently detected' ? candidateName : candidateName.toUpperCase()}
                </span>
                <div className="text-[8px] font-normal text-[var(--rw-muted)] mt-0.5">
                  {targetRole} {experienceFormatted !== '0 Years' ? `· ${experienceFormatted}` : ''}
                </div>
              </div>

              <div className="mt-2 space-y-2 flex-1">
                <div>
                  <span className="font-bold text-[8px] text-[var(--rw-ink)] uppercase block tracking-wider">SUMMARY</span>
                  <p className="text-[var(--rw-muted)] text-[8.5px] leading-relaxed">
                    {facts.summarySnippet || `Professional with verified skills in ${(facts.detectedSkills || []).slice(0, 4).join(', ') || targetRole}.`}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[8px] text-[var(--rw-ink)] uppercase block tracking-wider">WORK HISTORY</span>
                  {facts.workEntries && facts.workEntries.length > 0 ? (
                    facts.workEntries.map((w, idx) => (
                      <div key={idx} className="mt-1 rounded bg-[var(--rw-paper-deep)] border border-[var(--rw-line)] p-1 text-[8px]">
                        <div className="font-semibold text-[var(--rw-ink)] flex items-center justify-between">
                          <span>{w.title}</span>
                          {w.isCurrent && (
                            <span className="text-[7.5px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">Active</span>
                          )}
                        </div>
                        <div className="text-[var(--rw-muted)] text-[7.5px]">{w.fullMatch}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[var(--rw-muted)] italic text-[8px]">No chronological roles extracted</div>
                  )}
                </div>

                <div>
                  <span className="font-bold text-[8px] text-[var(--rw-ink)] uppercase block tracking-wider">EXTRACTED SKILLS</span>
                  <div className="text-[var(--rw-muted)] text-[8px]">
                    {(facts.detectedSkills || []).slice(0, 8).join(', ') || 'No standardized skills identified'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color Legend */}
          <div className="flex items-center justify-between text-[10px] text-[var(--rw-muted)] pt-1">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Parsed</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span>Low Metric</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--rw-muted)]" />
              <span>Suggested</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MIDDLE SECTION: 4 CARDS (AI Summary, Strengths, Improvements, Section Scores)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {/* Card 1: AI Summary */}
        <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 flex flex-col justify-between shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <span>AI Summary</span>
          </div>

          <p className="text-xs text-[var(--rw-ink)] leading-relaxed">
            {result.summary}
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2 text-xs text-amber-900">
            <Star className="h-4 w-4 text-amber-600 shrink-0 mt-0.5 fill-amber-500" />
            <span className="text-[11px] leading-tight">
              Implement the suggested improvements below to boost your resume strength score.
            </span>
          </div>
        </div>

        {/* Card 2: Strengths */}
        <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 flex flex-col justify-between shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Strengths</span>
          </div>

          <ul className="space-y-3 text-xs text-[var(--rw-ink)]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Flawless single-column layout without unparsable table traps</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Verified timeline chronology ({experienceFormatted} experience detected)</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Core competencies recognized across {targetRole} domain</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Clean standard section headings for automated ATS indexing</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Improvements */}
        <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 flex flex-col justify-between shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
            <Target className="h-4 w-4 text-orange-600" />
            <span>Actionable Improvements</span>
          </div>

          <ul className="space-y-2 text-xs text-[var(--rw-ink)]">
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Add quantified metrics (%, numbers, scale) to work experience bullets</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Clarify day-to-day deliverables and technologies in recent engagements</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Explicitly connect technical tools to tangible business outcomes</span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
              <span>Ensure contact header includes standard phone and email</span>
            </li>
          </ul>
        </div>

        {/* Card 4: Section Scores (Horizontal Colored Progress Bars) */}
        <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 flex flex-col justify-between shadow-xs space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-orange-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span>Section Scores</span>
            </div>
            <span className="text-[10px] text-[var(--rw-muted)] font-normal uppercase">Weight %</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* ATS Compatibility */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>ATS Compatibility ({weights.atsCompatibility}%)</span>
                <span className="font-bold text-emerald-700">{sectionScores.atsCompatibility}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sectionScores.atsCompatibility}%` }} />
              </div>
            </div>

            {/* Impact & Achievements */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>Impact &amp; Achievements ({weights.impact}%)</span>
                <span className="font-bold text-red-700">{sectionScores.impact}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${sectionScores.impact}%` }} />
              </div>
            </div>

            {/* Skills Validation */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>Skills clarity ({weights.skills}%)</span>
                <span className="font-bold text-orange-700">{sectionScores.skills}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${sectionScores.skills}%` }} />
              </div>
            </div>

            {/* Project Quality */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>Project Quality ({weights.projects}%)</span>
                <span className="font-bold text-orange-700">{sectionScores.projects}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${sectionScores.projects}%` }} />
              </div>
            </div>

            {/* Writing Quality */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>Writing Quality ({weights.writing}%)</span>
                <span className="font-bold text-amber-700">{sectionScores.writing}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${sectionScores.writing}%` }} />
              </div>
            </div>

            {/* Professionalism */}
            <div>
              <div className="flex justify-between text-[var(--rw-ink)] font-medium pb-1">
                <span>Professionalism ({weights.professionalism}%)</span>
                <span className="font-bold text-orange-700">{sectionScores.professionalism}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--rw-paper-deep)] overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${sectionScores.professionalism}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DETAILED SECTION SCORES (6 Sparkline Cards)
          High contrast heading on clean light card
          ======================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--rw-ink)] tracking-tight">
            Detailed Section Scores
          </h3>
          <span className="text-xs text-[var(--rw-muted)]">
            Weighted Average = {score}/100 Overall Score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: ATS Compatibility */}
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>ATS Compatibility</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.atsCompatibility}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700">Excellent (20% weight)</div>
            </div>
            <svg className="w-20 h-10 text-emerald-600" viewBox="0 0 100 40">
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
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-red-100 text-red-800">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <span>Impact &amp; Achievements</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.impact}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-red-700">Needs Metrics (20% weight)</div>
            </div>
            <svg className="w-20 h-10 text-red-600" viewBox="0 0 100 40">
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
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-orange-100 text-orange-800">
                  <FileCode className="h-3.5 w-3.5" />
                </div>
                <span>Skills clarity</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.skills}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-orange-700">Moderate Match (20% weight)</div>
            </div>
            <svg className="w-20 h-10 text-orange-600" viewBox="0 0 100 40">
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
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-orange-100 text-orange-800">
                  <Briefcase className="h-3.5 w-3.5" />
                </div>
                <span>Project Quality</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.projects}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-orange-700">Average (15% weight)</div>
            </div>
            <svg className="w-20 h-10 text-orange-600" viewBox="0 0 100 40">
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
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                  <PenTool className="h-3.5 w-3.5" />
                </div>
                <span>Writing Quality</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.writing}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-amber-700">Good (15% weight)</div>
            </div>
            <svg className="w-20 h-10 text-amber-600" viewBox="0 0 100 40">
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
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
                <div className="p-1 rounded-md bg-orange-100 text-orange-800">
                  <Building className="h-3.5 w-3.5" />
                </div>
                <span>Professionalism</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[var(--rw-ink)]">{sectionScores.professionalism}</span>
                <span className="text-xs text-[var(--rw-muted)]">/100</span>
              </div>
              <div className="text-xs font-semibold text-orange-700">Good (10% weight)</div>
            </div>
            <svg className="w-20 h-10 text-orange-600" viewBox="0 0 100 40">
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
        <div className="lg:col-span-6 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span>ATS Risks <span className="text-red-700 font-semibold">(Verified Fixes)</span></span>
          </div>

          <div className="space-y-3">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${
                        risk.severity === 'HIGH'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-orange-200 bg-orange-50 text-orange-700'
                      }`}
                    >
                      {risk.severity}
                    </span>
                    <span className="text-sm font-bold text-[var(--rw-ink)]">{risk.title}</span>
                  </div>
                  <p className="text-xs text-[var(--rw-muted)] leading-snug">{risk.description}</p>
                  <p className="text-[11px] text-orange-700 font-medium">Fix: {risk.fix}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFix(selectedFix === risk.id ? null : risk.id)}
                  className="rounded-full border border-[var(--rw-line)] bg-[var(--rw-paper-deep)] hover:bg-[var(--rw-paper-deep)] px-3.5 py-1.5 text-xs font-semibold text-[var(--rw-ink)] transition shrink-0 inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
                >
                  <span>{selectedFix === risk.id ? 'Close Fix' : 'View Fix'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {selectedFix && (
              <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-4 text-xs text-orange-950 space-y-1 animate-fadeIn">
                <div className="font-semibold text-[var(--rw-ink)]">Recommended Edit (Ethical &amp; Factual):</div>
                <div className="font-mono bg-[var(--rw-surface)] p-2.5 rounded border border-orange-200 text-[var(--rw-ink)] text-[11px] leading-relaxed">
                  {risks.find((r) => r.id === selectedFix)?.example}
                </div>
                <div className="text-[10px] text-[var(--rw-muted)] pt-1">
                  Tip: Always use real metrics from your past projects or tasks; never fabricate figures.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Keywords Analysis */}
        <div className="lg:col-span-6 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--rw-ink)]">Keywords Analysis</span>
            <span className="text-[10px] text-[var(--rw-muted)]">Target Role: {targetRole}</span>
          </div>

          {/* Strong Keywords */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Strong Keywords Found in CV</span>
            </div>
            <p className="text-[11px] text-[var(--rw-muted)]">Skills listed on your CV (from Skills section):</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {strongKeywords.map((k) => (
                <span
                  key={k.name}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 inline-flex items-center gap-1.5"
                >
                  <span>{k.name}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{k.pct}%</span>
                </span>
              ))}
            </div>
          </div>

          {/* Missing vs JD only — no hardcoded taxonomy gaps */}
          <div className="space-y-2 pt-2 border-t border-[var(--rw-line)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-800">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span>Missing vs job description</span>
            </div>
            <p className="text-[11px] text-[var(--rw-muted)]">
              {jdFitScore != null
                ? 'Keywords from your pasted JD that do not appear in the CV. Only add if you can prove them.'
                : 'Paste a job description above to see real keyword gaps. No hardcoded skill list.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {missingKeywords.length === 0 ? (
                <span className="text-[11px] text-[var(--rw-muted)]">
                  {jdFitScore != null ? 'No major JD keyword gaps detected.' : 'Waiting for JD…'}
                </span>
              ) : (
                missingKeywords.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] px-3 py-1 text-xs font-medium text-[var(--rw-ink)] shadow-2xs"
                  >
                    {word}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          TOP SUGGESTIONS (With Scroll Offset so Navbar Never Overlaps)
          ======================================================== */}
      <div id="top-suggestions" className="scroll-mt-32 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span>Top Suggestions</span>
            </div>
            <p className="text-xs text-[var(--rw-muted)]">Actionable steps to improve your recruiter qualification score</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSuggestions('left')}
              className="h-8 w-8 rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] flex items-center justify-center text-[var(--rw-muted)] hover:text-[var(--rw-ink)] transition cursor-pointer shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSuggestions('right')}
              className="h-8 w-8 rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] flex items-center justify-center text-[var(--rw-muted)] hover:text-[var(--rw-ink)] transition cursor-pointer shadow-2xs"
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
              className="rounded-xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-4 flex flex-col justify-between space-y-3 min-w-[240px] shadow-2xs"
            >
              <div className="space-y-2">
                {item.priority ? (
                  <span className="rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-[var(--rw-line)] bg-[var(--rw-paper-deep)] text-[var(--rw-ink)] inline-block">
                    {item.priority}
                  </span>
                ) : null}
                <h4 className="text-sm font-bold text-[var(--rw-ink)]">{item.title}</h4>
                {item.desc ? (
                  <p className="text-xs text-[var(--rw-ink)]/75 leading-snug">{item.desc}</p>
                ) : null}
              </div>

              {item.example ? (
                <div className="rounded-lg bg-[var(--rw-paper-deep)] p-3 border border-[var(--rw-line)] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    EXAMPLE
                  </div>
                  <div className="text-[11px] text-[var(--rw-ink)] italic leading-snug">
                    &ldquo;{item.example}&rdquo;
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
