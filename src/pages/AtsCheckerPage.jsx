import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Upload } from 'lucide-react';
import Logo from '../components/Logo';
import AtsScorePanel from '../components/AtsScorePanel';
import { API_URL } from '../lib/api';
import { surfaces } from '../lib/surfaces';

export default function AtsCheckerPage() {
  const [mode, setMode] = useState('upload'); // 'upload' | 'text'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function switchMode(next) {
    setMode(next);
    setError('');
    setResult(null);
    if (next === 'upload') setText('');
    else setFile(null);
  }

  async function runCheck(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let response;
      if (mode === 'upload') {
        if (!file) throw new Error('Choose a PDF or DOCX file');
        const fd = new FormData();
        fd.append('file', file);
        response = await fetch(`${API_URL}/cv/ats-check`, { method: 'POST', body: fd });
      } else {
        if (!text.trim()) throw new Error('Paste resume text first');
        response = await fetch(`${API_URL}/cv/ats-check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'ATS check failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'ATS check failed');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = mode === 'upload' ? Boolean(file) : Boolean(text.trim());

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Logo className="h-7 w-7 text-sm" />
            RightWay
          </Link>
          <a
            href={surfaces.candidateRegister()}
            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Continue as job seeker
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900">
          <ArrowLeft className="h-3.5 w-3.5" /> Back home
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Free ATS resume checker
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Upload a PDF/DOCX or paste text. We score contact info, sections, skills, dates, education,
            length, keywords, layout smell, and text extractability — no login required.
          </p>
        </div>

        <form onSubmit={runCheck} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div
            role="tablist"
            aria-label="Resume input method"
            className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'upload'}
              onClick={() => switchMode('upload')}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === 'upload'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => switchMode('text')}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === 'text'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              Text
            </button>
          </div>

          {mode === 'upload' ? (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                PDF or DOCX
              </span>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3">
                <Upload className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                />
              </div>
              {file ? (
                <p className="mt-2 truncate text-xs text-zinc-500">{file.name}</p>
              ) : null}
            </label>
          ) : (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Paste resume text
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                placeholder="Paste or type resume text here…"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Run free ATS check'}
          </button>
        </form>

        <AtsScorePanel result={result} loading={loading} error={error} />
      </main>
    </div>
  );
}

