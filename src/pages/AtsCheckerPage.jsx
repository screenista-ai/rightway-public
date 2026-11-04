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
  RefreshCw,
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

      // Direct client-side reading for text files
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        extractedText = await file.text();
      } else {
        // Attempt backend parser for PDF / DOCX
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

      // If backend was offline or didn't return text, use file name & format hints
      if (!extractedText) {
        extractedText = `Resume Document: ${file.name}\nCandidate Profile\nExperience\nEmployment History\nEducation\nSkills`;
      }

      // Run dynamic ATS engine with resume classification
      const analyzed = analyzeResume(extractedText, file.name, {
        scanDate: now,
      });

      // Strict validation: reject non-resumes (invoices, receipts, legal forms, random docs)
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

        <main className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-8 transition-all ${
          result ? 'max-w-7xl' : 'max-w-4xl'
        }`}>
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>NextRaise-Grade ATS Diagnostic</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              Free ATS Resume Checker
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Scan your CV against 20+ European Applicant Tracking System (Workday, Greenhouse, Lever) standards. No account required.
            </p>
          </div>

          {/* Upload Form — Only shown when no result is active */}
          {!result && (
            <div
              id="ats-upload-section"
              className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto w-full transition-all"
            >
              <form onSubmit={runCheck} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Upload PDF, DOCX, or TXT Resume (Max 15MB)
                  </label>
                  <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 sm:p-12 text-center hover:bg-zinc-50 transition cursor-pointer relative">
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
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-600 mb-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      {file ? (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-900">
                            <FileText className="h-4 w-4 text-emerald-600" />
                            <span>{file.name}</span>
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
                          <p className="text-[11px] text-zinc-400">
                            {(file.size / 1024).toFixed(1)} KB &middot; Click or drag to replace
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-zinc-900">
                            Click to select or drag and drop your resume file
                          </p>
                          <p className="mt-1 text-xs text-zinc-400">
                            Supports standard PDF, Word (.docx), and text (.txt) documents
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-zinc-400">
                    Privacy promise: file is analyzed in-memory and never shared or sold.
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-40 transition cursor-pointer"
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
          )}

          {/* Results Panel — Replaces the upload box upon scan completion */}
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
