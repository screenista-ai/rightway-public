import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AtsScorePanel from '../components/AtsScorePanel';
import { API_URL } from '../lib/api';
import { surfaces } from '../lib/surfaces';
import { analyzeResume } from '../lib/atsEngine';
import { scoreJdFit } from '../lib/jdFit';
import {
  Upload,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Check,
  FileText,
  X,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export default function AtsCheckerPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [suggestEnabled, setSuggestEnabled] = useState(false);
  const fileInputRef = useRef(null);

  function handleRemoveFile(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFile(null);
    setResult(null);
    setCvText('');
    setJobDescription('');
    setAiSuggestions(null);
    setSuggestError('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileSelected(selectedFile) {
    if (!selectedFile) return;
    setError('');
    setResult(null);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError('Invalid format. Only PDF and DOCX files are accepted.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(`File exceeds 5MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB).`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
  }

  function handleReanalyze() {
    handleRemoveFile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function runCheck(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF or DOCX resume.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const now = new Date();

    try {
      let extractedText = '';
      let docHtml = null;

      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        extractedText = await file.text();
      } else {
        const fd = new FormData();
        fd.append('file', file);
        const response = await fetch(`${API_URL}/cv/ats-check`, {
          method: 'POST',
          body: fd,
        }).catch(() => null);

        if (response && response.ok) {
          const data = await response.json().catch(() => ({}));
          extractedText = data.text || '';
          docHtml = data.documentHtml || null;
        } else if (response && !response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Server rejected file.');
        } else {
          throw new Error('Unable to reach ATS parser service. Please try again.');
        }
      }

      if (!extractedText || !extractedText.trim()) {
        throw new Error('Could not extract readable text from document. Scanned or image-only PDFs require OCR.');
      }

      const analyzed = analyzeResume(extractedText, file.name, {
        scanDate: now,
      });

      if (!analyzed.isResume) {
        setError(analyzed.error || 'The uploaded file does not appear to be a standard resume or CV. Please upload a document containing work experience and education.');
        setResult(null);
        return;
      }

      setCvText(extractedText);
      setAiSuggestions(null);
      setSuggestError('');
      const jdFit = scoreJdFit(extractedText, jobDescription);
      setResult({
        ...analyzed,
        documentHtml: docHtml,
        cvText: extractedText,
        jdFit,
        scoreLabel: 'Readability',
      });
      fetch(`${API_URL}/cv/ats-suggest/status`)
        .then((r) => r.json())
        .then((s) => setSuggestEnabled(Boolean(s.suggestEnabled)))
        .catch(() => setSuggestEnabled(false));
    } catch (err) {
      setError(err.message || 'Could not analyze document. Please ensure your file contains readable text.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function applyJdFit(nextJd = jobDescription) {
    if (!cvText) return;
    const jdFit = scoreJdFit(cvText, nextJd);
    setResult((prev) => (prev ? { ...prev, jdFit } : prev));
  }

  async function runAiSuggest() {
    if (!cvText) {
      setSuggestError('Analyze a resume first.');
      return;
    }
    setSuggestLoading(true);
    setSuggestError('');
    try {
      const res = await fetch(`${API_URL}/cv/ats-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          jobDescription,
          targetRole: result?.targetRole || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'AI suggestions failed');
      if (data.jdFit) setResult((prev) => (prev ? { ...prev, jdFit: data.jdFit } : prev));
      setAiSuggestions(data.suggestions || null);
      setSuggestEnabled(true);
    } catch (err) {
      setSuggestError(err.message || 'AI suggestions failed');
      setAiSuggestions(null);
    } finally {
      setSuggestLoading(false);
    }
  }

  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent-3)] selection:text-white flex flex-col justify-between">

      <div>
        <Navbar />

        <main className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-10 transition-all ${
          result ? 'max-w-7xl' : 'max-w-6xl'
        }`}>
          {!result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 sm:pt-8">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rw-accent-3)]/30 bg-[var(--rw-coral-soft)] px-3 py-1 text-[11px] font-semibold text-orange-800 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--rw-accent-3)]" />
                  <span>AI POWERED</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-[var(--rw-ink)] leading-[1.1]">
                    <span className="bg-gradient-to-r from-[var(--rw-accent)] via-[var(--rw-accent-2)] to-[var(--rw-accent-3)] bg-clip-text text-transparent">
                      ATS Resume
                    </span>
                    <br />
                    Scanner
                  </h1>
                  <p className="text-sm sm:text-base text-[var(--rw-muted)] leading-relaxed max-w-lg">
                    Get ATS score, keyword analysis, recruiter insights, and AI powered improvements in seconds.
                  </p>
                </div>

                {/* 3 Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--rw-line)]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--rw-ink)]">
                      <Zap className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Instant Results</span>
                    </div>
                    <p className="text-[11px] text-[var(--rw-muted)]">In seconds</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--rw-ink)]">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>100% Secure</span>
                    </div>
                    <p className="text-[11px] text-[var(--rw-muted)]">Your data is safe</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--rw-ink)]">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
                      <span>AI Powered</span>
                    </div>
                    <p className="text-[11px] text-[var(--rw-muted)]">Smart suggestions</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Upload Card */}
              <div className="lg:col-span-6">
                <div
                  id="ats-upload-section"
                  className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-6 sm:p-8 shadow-sm space-y-5 w-full"
                >
                  <form onSubmit={runCheck} className="space-y-5">
                    <div className="rounded-2xl border-2 border-dashed border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/60 p-8 sm:p-10 text-center hover:bg-[var(--rw-paper-deep)] transition cursor-pointer relative overflow-hidden">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          handleFileSelected(e.target.files?.[0]);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      <div className="relative z-20 flex flex-col items-center justify-center space-y-3 pointer-events-none">
                        {/* Document Icon with sparkle */}
                        <div className="relative">
                          <div className="h-14 w-12 rounded-xl bg-[var(--rw-paper-deep)] border border-[var(--rw-line)] flex flex-col items-center justify-center text-[var(--rw-muted)] shadow-2xs">
                            <FileText className="h-6 w-6 text-emerald-700" />
                            <span className="text-[8px] font-bold text-[var(--rw-muted)] uppercase mt-0.5">PDF / DOCX</span>
                          </div>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600 absolute -top-1 -right-1" />
                        </div>

                        {file ? (
                          <div className="space-y-1.5 pointer-events-auto">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--rw-surface)] border border-[var(--rw-line)] px-4 py-1.5 text-xs font-semibold text-[var(--rw-ink)] shadow-2xs">
                              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span className="max-w-[200px] truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="relative z-30 ml-1 rounded-full p-1 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] hover:text-rose-600 transition cursor-pointer"
                                title="Remove resume"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-[var(--rw-muted)]">
                              {(file.size / 1024).toFixed(1)} KB &middot; Click or drag to replace
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-[var(--rw-ink)]">
                              Drag &amp; drop your resume here
                            </p>
                            <p className="text-xs text-[var(--rw-muted)]">
                              or click to browse
                            </p>
                          </div>
                        )}

                        <div className="pt-1">
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs">
                            <Upload className="h-3.5 w-3.5 text-emerald-700" />
                            <span>{file ? 'Change Resume' : 'Upload Resume'}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--rw-muted)] pt-1">
                          Supported formats: PDF, DOCX &bull; Max 5MB
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <span className="text-[11px] text-[var(--rw-muted)]">
                        Privacy promise: file analyzed in-memory and never shared.
                      </span>

                      <button
                        type="submit"
                        disabled={loading || !file}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--rw-ink)] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition cursor-pointer shrink-0"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>{loading ? 'Analyzing Resume…' : 'Calculate ATS Score'}</span>
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results Panel — Replaces the hero/upload box upon scan completion */}
          {result && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-5 sm:p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--rw-ink)]">Job description (optional)</h3>
                  <p className="text-xs text-[var(--rw-muted)] mt-0.5">
                    Fit % is local keyword overlap vs this JD. AI tips use OpenRouter when enabled.
                  </p>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    const v = e.target.value;
                    setJobDescription(v);
                    applyJdFit(v);
                  }}
                  rows={5}
                  placeholder="Paste the job description you are targeting…"
                  className="w-full rounded-xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/50 px-3.5 py-2.5 text-sm text-[var(--rw-ink)] focus:border-zinc-900 focus:bg-[var(--rw-surface)] focus:outline-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyJdFit()}
                    className="rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] px-4 py-2 text-xs font-semibold text-[var(--rw-ink)] hover:bg-[var(--rw-paper-deep)]"
                  >
                    Refresh JD fit
                  </button>
                  <button
                    type="button"
                    disabled={suggestLoading || !suggestEnabled}
                    onClick={runAiSuggest}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--rw-ink)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {suggestLoading ? 'Getting AI tips…' : 'Get AI suggestions'}
                  </button>
                  {!suggestEnabled ? (
                    <span className="text-[11px] text-[var(--rw-muted)]">AI off — set OPENROUTER_API_KEY on API</span>
                  ) : null}
                </div>
                {suggestError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {suggestError}
                  </div>
                ) : null}
                {aiSuggestions ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                      AI suggestions · not an ATS vendor score
                    </p>
                    {aiSuggestions.summary ? (
                      <p className="text-sm text-[var(--rw-ink)]">{aiSuggestions.summary}</p>
                    ) : null}
                    {aiSuggestions.gaps?.length ? (
                      <div>
                        <div className="text-xs font-semibold text-[var(--rw-muted)] mb-1">Gaps</div>
                        <ul className="list-disc pl-4 text-xs text-[var(--rw-muted)] space-y-0.5">
                          {aiSuggestions.gaps.map((g) => (
                            <li key={g}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {aiSuggestions.tips?.length ? (
                      <div>
                        <div className="text-xs font-semibold text-[var(--rw-muted)] mb-1">Tips</div>
                        <ul className="list-disc pl-4 text-xs text-[var(--rw-muted)] space-y-0.5">
                          {aiSuggestions.tips.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {aiSuggestions.rewrites?.length ? (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[var(--rw-muted)]">Rewrites</div>
                        {aiSuggestions.rewrites.map((r, i) => (
                          <div key={`${r.before}-${i}`} className="rounded-xl bg-[var(--rw-surface)] border border-[var(--rw-line)] p-3 text-xs space-y-1">
                            <p className="text-[var(--rw-muted)] line-through">{r.before}</p>
                            <p className="text-[var(--rw-ink)] font-medium">{r.after}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <AtsScorePanel
                result={result}
                file={file}
                loading={loading}
                error={error}
                onReanalyze={handleReanalyze}
              />

              {/* Conversion card to Candidate Profile */}
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[var(--rw-ink)]">Turn this CV into a Verified RightWay Profile</h3>
                  <p className="text-xs sm:text-sm text-[var(--rw-muted)]">
                    Lock in proof for every claim. European recruiters review pre-verified RightWay CVs 4x faster.
                  </p>
                </div>
                <a
                  href={surfaces.candidateRegister()}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--rw-ink)] px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition shrink-0"
                >
                  <span>Build Verified CV</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* Educational Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[var(--rw-ink)] font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Single Column Layout</span>
              </div>
              <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
                Multi-column tables and complex graphic sidebars get jumbled by Workday and Greenhouse parsers. Keep structure linear.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[var(--rw-ink)] font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Standard Section Headers</span>
              </div>
              <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
                Use exact keywords: Experience, Education, Skills, and Summary so parsers place each attribute in the correct category.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[var(--rw-ink)] font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Verified Fact Passport</span>
              </div>
              <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
                RightWay attaches verified proof to degrees and certificates so HR can skip manual credential screening.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
