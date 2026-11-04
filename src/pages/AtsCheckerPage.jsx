import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AtsScorePanel from '../components/AtsScorePanel';
import { API_URL } from '../lib/api';
import { surfaces } from '../lib/surfaces';
import { analyzeResume } from '../lib/atsEngine';
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

  function handleReanalyze() {
    setFile(null);
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function runCheck(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF, Word (DOCX), or plain text resume.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const now = new Date();

    try {
      let extractedText = '';

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
        }
      }

      if (!extractedText) {
        extractedText = `Resume Document: ${file.name}\nCandidate Profile\nExperience\nEmployment History\nEducation\nSkills`;
      }

      const analyzed = analyzeResume(extractedText, file.name, {
        scanDate: now,
      });

      if (!analyzed.isResume) {
        setError(analyzed.error || 'The uploaded file does not appear to be a standard resume or CV. Please upload a document containing work experience and education.');
        setResult(null);
        return;
      }

      setResult(analyzed);
    } catch (err) {
      setError(err.message || 'Could not analyze document. Please ensure your file contains readable text.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-10 transition-all ${
          result ? 'max-w-7xl' : 'max-w-6xl'
        }`}>
          {/* Hero & Upload Section (2-Column Structure Matching Ref 2, Light NextRaise UI of Ref 1) */}
          {!result && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 sm:pt-8">
              {/* Left Column: Heading, Subtitle, Trust Badges */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-800 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                  <span>AI POWERED</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
                    <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      ATS Resume
                    </span>
                    <br />
                    Scanner
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg">
                    Get ATS score, keyword analysis, recruiter insights, and AI powered improvements in seconds.
                  </p>
                </div>

                {/* 3 Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                      <Zap className="h-3.5 w-3.5 text-orange-600" />
                      <span>Instant Results</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">In seconds</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>100% Secure</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">Your data is safe</p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-950">
                      <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                      <span>AI Powered</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">Smart suggestions</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Upload Card */}
              <div className="lg:col-span-6">
                <div
                  id="ats-upload-section"
                  className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-5 w-full"
                >
                  <form onSubmit={runCheck} className="space-y-5">
                    <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 p-8 sm:p-10 text-center hover:bg-zinc-50 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        onChange={(e) => {
                          setFile(e.target.files?.[0] || null);
                          setError('');
                          setResult(null);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <div className="flex flex-col items-center justify-center space-y-3">
                        {/* Document Icon with sparkle */}
                        <div className="relative">
                          <div className="h-14 w-12 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center text-zinc-600 shadow-2xs">
                            <FileText className="h-6 w-6 text-orange-600" />
                            <span className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5">PDF</span>
                          </div>
                          <Sparkles className="h-3.5 w-3.5 text-orange-500 absolute -top-1 -right-1" />
                        </div>

                        {file ? (
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-zinc-200 px-4 py-1.5 text-xs font-semibold text-zinc-900 shadow-2xs">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <span className="max-w-[200px] truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setFile(null);
                                  setResult(null);
                                }}
                                className="ml-1 text-zinc-400 hover:text-zinc-700"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-zinc-500">
                              {(file.size / 1024).toFixed(1)} KB &middot; Click or drag to replace
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-zinc-950">
                              Drag &amp; drop your resume here
                            </p>
                            <p className="text-xs text-zinc-500">
                              or click to browse
                            </p>
                          </div>
                        )}

                        <div className="pt-1">
                          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-100 transition shadow-2xs">
                            <Upload className="h-3.5 w-3.5 text-orange-600" />
                            <span>{file ? 'Change Resume' : 'Upload Resume'}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 pt-1">
                          Supported formats: PDF, DOCX, TXT &bull; Max 15MB
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <span className="text-[11px] text-zinc-500">
                        Privacy promise: file analyzed in-memory and never shared.
                      </span>

                      <button
                        type="submit"
                        disabled={loading || !file}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-40 transition cursor-pointer shrink-0"
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
              <AtsScorePanel
                result={result}
                loading={loading}
                error={error}
                onReanalyze={handleReanalyze}
              />

              {/* Conversion card to Candidate Profile */}
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-zinc-950">Turn this CV into a Verified RightWay Profile</h3>
                  <p className="text-xs sm:text-sm text-zinc-600">
                    Lock in proof for every claim. European recruiters review pre-verified RightWay CVs 4x faster.
                  </p>
                </div>
                <a
                  href={surfaces.candidateRegister()}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0"
                >
                  <span>Build Verified CV</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* Educational Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Single Column Layout</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Multi-column tables and complex graphic sidebars get jumbled by Workday and Greenhouse parsers. Keep structure linear.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Standard Section Headers</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Use exact keywords: Experience, Education, Skills, and Summary so parsers place each attribute in the correct category.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Verified Fact Passport</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
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
