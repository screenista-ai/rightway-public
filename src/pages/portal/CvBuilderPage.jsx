import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RESUME_TEMPLATES } from '@rightway/shared';
import { API_URL, api } from '../../lib/api.js';
import AtsScorePanel from '../../components/AtsScorePanel.jsx';

const DEFAULT_SLOTS = [1, 2, 3, 4, 5].map((slot) => ({
  slot,
  name: `Resume ${slot}`,
  summary: '',
  selectedTemplateId: 'modern-ats-classic',
  lastAtsScore: null,
  lastAtsBreakdown: null,
}));

export default function CvBuilderPage() {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [activeSlot, setActiveSlot] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const active = slots.find((s) => s.slot === activeSlot) || slots[0];

  useEffect(() => {
    api('/candidates/profile')
      .then((data) => {
        setProfile(data);
        if (Array.isArray(data.customResumes) && data.customResumes.length) {
          const merged = DEFAULT_SLOTS.map((d) => {
            const found = data.customResumes.find((r) => r.slot === d.slot);
            return found ? { ...d, ...found } : d;
          });
          setSlots(merged);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(RESUME_TEMPLATES.map((t) => t.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredTemplates = RESUME_TEMPLATES.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  const selectedTemplate =
    RESUME_TEMPLATES.find((t) => t.id === active?.selectedTemplateId) || RESUME_TEMPLATES[0];

  const previewLines = useMemo(() => {
    if (!profile) return [];
    const name = [profile.user?.firstName, profile.user?.lastName].filter(Boolean).join(' ') || 'Candidate';
    const lines = [
      name,
      profile.user?.email || '',
      profile.phone || '',
      profile.careerStage ? `Stage: ${profile.careerStage}` : '',
      active?.summary ? `Summary: ${active.summary}` : '',
      '',
      'Experience:',
      ...(profile.experiences || []).slice(0, 3).map(
        (e) => `• ${e.jobTitle} @ ${e.companyName}`
      ),
      '',
      'Education:',
      ...(profile.educations || []).slice(0, 2).map(
        (e) => `• ${e.degree} — ${e.institution}`
      ),
      '',
      'Skills:',
      (profile.skills || []).slice(0, 12).map((s) => s.skillName).join(', ') || '—',
    ];
    return lines.filter((l, i) => l !== '' || (lines[i - 1] !== '' && lines[i + 1] !== ''));
  }, [profile, active]);

  function updateActive(patch) {
    setSlots((prev) => prev.map((s) => (s.slot === activeSlot ? { ...s, ...patch } : s)));
  }

  async function saveSlot(extra = {}) {
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        slot: activeSlot,
        name: extra.name ?? active.name,
        summary: extra.summary ?? active.summary,
        selectedTemplateId: extra.selectedTemplateId ?? active.selectedTemplateId,
        lastAtsScore: extra.lastAtsScore ?? active.lastAtsScore,
        lastAtsBreakdown: extra.lastAtsBreakdown ?? active.lastAtsBreakdown,
      };
      const data = await api('/candidates/profile/resumes', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      setProfile(data);
      if (Array.isArray(data.customResumes)) {
        setSlots(DEFAULT_SLOTS.map((d) => {
          const found = data.customResumes.find((r) => r.slot === d.slot);
          return found ? { ...d, ...found } : d;
        }));
      }
      setSuccessMsg('Resume slot saved.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function runAts() {
    setAtsLoading(true);
    setAtsError('');
    try {
      const text = [
        ...previewLines,
        active.summary,
        ...(profile?.skills || []).map((s) => s.skillName),
      ]
        .filter(Boolean)
        .join('\n');
      const res = await fetch(`${API_URL}/cv/ats-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ATS check failed');
      updateActive({ lastAtsScore: data.score, lastAtsBreakdown: data });
      await saveSlot({ lastAtsScore: data.score, lastAtsBreakdown: data });
    } catch (err) {
      setAtsError(err.message || 'ATS check failed');
    } finally {
      setAtsLoading(false);
    }
  }

  async function generatePdf() {
    setGenerating(true);
    setError('');
    setPdfUrl('');
    try {
      await saveSlot();
      const created = await api('/cv/generate', {
        method: 'POST',
        body: JSON.stringify({
          documentType: 'EUROPASS_CV',
          templateId: active.selectedTemplateId,
        }),
      });
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const row = await api(`/cv/${created.id}`);
        if (row.s3PdfUrl) {
          const blob = await api(`/cv/${created.id}/file`);
          setPdfUrl(URL.createObjectURL(blob));
          break;
        }
        await new Promise((r) => setTimeout(r, 800));
      }
    } catch (err) {
      setError(err.message || 'Generate failed');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Resumes</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Five custom resumes, ATS scores, and 20 templates bound to your profile data.
          </p>
        </div>
        {!profile?.profileBasicsComplete ? (
          <Link
            to="/portal/profile"
            className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900"
          >
            Complete profile first
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {successMsg ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMsg}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {slots.map((s) => (
          <button
            key={s.slot}
            type="button"
            onClick={() => setActiveSlot(s.slot)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              activeSlot === s.slot
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
            }`}
          >
            {s.name || `Resume ${s.slot}`}
            {s.lastAtsScore != null ? (
              <span className="ml-1.5 opacity-80">· {s.lastAtsScore}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Resume name</span>
            <input
              value={active?.name || ''}
              onChange={(e) => updateActive({ name: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Targeting summary</span>
            <textarea
              value={active?.summary || ''}
              onChange={(e) => updateActive({ summary: e.target.value })}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder="What this resume optimizes for…"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveSlot()}
              disabled={saving}
              className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save slot'}
            </button>
            <button
              type="button"
              onClick={runAts}
              disabled={atsLoading}
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800"
            >
              {atsLoading ? 'Scoring…' : 'Run ATS on profile+summary'}
            </button>
            <button
              type="button"
              onClick={generatePdf}
              disabled={generating}
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800"
            >
              {generating ? 'Generating…' : 'Generate PDF'}
            </button>
          </div>

          <AtsScorePanel
            result={active?.lastAtsBreakdown || null}
            loading={atsLoading}
            error={atsError}
          />
        </section>

        <section className="space-y-4">
          <div
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm min-h-[280px]"
            style={{ borderTop: `4px solid ${selectedTemplate.accentColor}` }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Live preview · {selectedTemplate.name}
            </div>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800">
              {previewLines.join('\n') || 'Load profile to preview…'}
            </pre>
          </div>

          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-semibold text-zinc-700 underline"
            >
              Open generated PDF
            </a>
          ) : null}
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">
            Templates ({RESUME_TEMPLATES.length})
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoryFilter(c)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  categoryFilter === c ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((t) => {
            const selected = active?.selectedTemplateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  updateActive({ selectedTemplateId: t.id });
                  saveSlot({ selectedTemplateId: t.id });
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  selected ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div className="h-1.5 w-10 rounded-full" style={{ background: t.accentColor }} />
                <div className="mt-2 text-sm font-semibold text-zinc-900">{t.name}</div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  {t.category}
                </div>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{t.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
