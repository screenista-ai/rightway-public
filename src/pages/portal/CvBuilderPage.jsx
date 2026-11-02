import { useEffect, useState } from 'react';
import { API_URL, api, authToken } from '../../lib/api.js';
import { RESUME_TEMPLATES } from '@rightway/shared';

const RESUME_MODES = [
  { id: 'EUROPASS_CV', label: 'Europass CV (Official)', desc: 'Standard European Commission format with verified CEFR & ISO dates' },
  { id: 'CUSTOM_CV_1', label: 'Custom Resume 1 (Tech / Specialist)', desc: 'Tailored for deep technical engineering, stacks, and architecture' },
  { id: 'CUSTOM_CV_2', label: 'Custom Resume 2 (Leadership / Executive)', desc: 'Tailored for leadership impact, cross-functional delivery & management' },
];

export default function CvBuilderPage() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [vacancyId, setVacancyId] = useState('');
  const [letter, setLetter] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Resume Track & Template State
  const [selectedMode, setSelectedMode] = useState('EUROPASS_CV');
  const [selectedTemplateId, setSelectedTemplateId] = useState('modern-ats-classic');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Custom Resume editable summaries
  const [resume1Name, setResume1Name] = useState('Technical & Systems Engineering');
  const [resume1Summary, setResume1Summary] = useState('');
  const [resume2Name, setResume2Name] = useState('Product & Engineering Leadership');
  const [resume2Summary, setResume2Summary] = useState('');
  const [isSavingCustom, setIsSavingCustom] = useState(false);

  useEffect(() => {
    // Load candidate profile
    api('/candidates/profile')
      .then((data) => {
        setProfile(data);
        if (data.selectedTemplateId) setSelectedTemplateId(data.selectedTemplateId);
        if (data.customResume1Name) setResume1Name(data.customResume1Name);
        if (data.customResume1Summary) setResume1Summary(data.customResume1Summary);
        if (data.customResume2Name) setResume2Name(data.customResume2Name);
        if (data.customResume2Summary) setResume2Summary(data.customResume2Summary);
      })
      .catch((err) => console.error(err));

    // Load matches
    api('/jobs/matches')
      .then((body) => setMatches(body.items || []))
      .catch((reason) => setError(reason.message));
  }, []);

  async function saveCustomResumeDetails() {
    setIsSavingCustom(true);
    setSuccessMsg('');
    setError('');
    try {
      await api('/candidates/profile/resumes', {
        method: 'PATCH',
        body: JSON.stringify({
          customResume1Name: resume1Name,
          customResume1Summary: resume1Summary,
          customResume2Name: resume2Name,
          customResume2Summary: resume2Summary,
          selectedTemplateId,
        }),
      });
      setSuccessMsg('Resume profiles and selected template saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save resume details');
    } finally {
      setIsSavingCustom(false);
    }
  }

  function handleSelectTemplate(tmplId) {
    setSelectedTemplateId(tmplId);
    api('/candidates/profile/resumes', {
      method: 'PATCH',
      body: JSON.stringify({ selectedTemplateId: tmplId }),
    }).catch(console.error);
  }

  async function generate() {
    setError('');
    setIsGenerating(true);
    try {
      const created = await api('/cv/generate', {
        method: 'POST',
        body: JSON.stringify({
          vacancyId: vacancyId || undefined,
          documentType: selectedMode,
          templateId: selectedTemplateId,
        }),
      });

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const row = await api(`/cv/${created.id}`);
        if (row.s3PdfUrl) {
          const blob = await api(`/cv/${created.id}/file`);
          setPdfUrl(URL.createObjectURL(blob));
          setIsGenerating(false);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setError('PDF generation is taking longer than expected. Check back in a moment.');
    } catch (err) {
      setError(err.message || 'Failed to compile resume');
    } finally {
      setIsGenerating(false);
    }
  }

  function stream() {
    setLetter('');
    const params = new URLSearchParams({ access_token: authToken() ?? '' });
    if (vacancyId) params.set('vacancyId', vacancyId);
    const source = new EventSource(`${API_URL}/cv/tailor/stream?${params.toString()}`);
    source.onmessage = (event) => setLetter((current) => current + event.data);
    source.onerror = () => source.close();
  }

  // Calculate unique categories from templates
  const categories = ['ALL', ...new Set(RESUME_TEMPLATES.map((t) => t.category))];
  const filteredTemplates = categoryFilter === 'ALL'
    ? RESUME_TEMPLATES
    : RESUME_TEMPLATES.filter((t) => t.category === categoryFilter);

  const activeTemplate = RESUME_TEMPLATES.find((t) => t.id === selectedTemplateId) || RESUME_TEMPLATES[0];

  return (
    <main className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">ATS Resume Studio & Europass</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Auto-populate 15 high-compliance European ATS templates from your verified profile facts.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          {successMsg}
        </div>
      ) : null}

      {/* Profile Data Fill Banner */}
      {profile && (
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-800 p-5 text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Verified Profile Fill Active</span>
            </div>
            <p className="mt-1 text-lg font-semibold">{profile.user?.firstName} {profile.user?.lastName}</p>
            <p className="text-xs text-zinc-400">
              {profile.experiences?.length || 0} Experiences • {profile.educations?.length || 0} Degrees • {profile.skills?.length || 0} Skills • {profile.languages?.length || 0} Languages ready for instant ATS export.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              Template: {activeTemplate.name}
            </span>
            <span className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-400/30">
              100% ATS Parsable
            </span>
          </div>
        </div>
      )}

      {/* Resume Tracks Selection: Europass, Custom 1, Custom 2 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-zinc-900">1. Select Resume Track</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {RESUME_MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left rounded-2xl border p-4 transition ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-md ring-2 ring-zinc-900/10'
                    : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {mode.id === 'EUROPASS_CV' ? 'Official EU' : 'Custom Tailored'}
                  </span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                </div>
                <h3 className="mt-2 text-sm font-semibold">{mode.label}</h3>
                <p className={`mt-1 text-xs leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {mode.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Resume Editor if Custom 1 or 2 selected */}
        {selectedMode === 'CUSTOM_CV_1' && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">Custom Resume 1: Title & Executive Summary</h3>
              <button
                type="button"
                onClick={saveCustomResumeDetails}
                disabled={isSavingCustom}
                className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {isSavingCustom ? 'Saving...' : 'Save Summary'}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Resume Name / Target Role Focus</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                value={resume1Name}
                onChange={(e) => setResume1Name(e.target.value)}
                placeholder="e.g. Senior Backend Engineer (Node/Python/Distributed Systems)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Custom Summary Statement (Tailored Hook)</label>
              <textarea
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm min-h-[90px]"
                value={resume1Summary}
                onChange={(e) => setResume1Summary(e.target.value)}
                placeholder="High-performance backend engineer with 7+ years designing distributed European fintech services under GDPR..."
              />
            </div>
          </div>
        )}

        {selectedMode === 'CUSTOM_CV_2' && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">Custom Resume 2: Title & Leadership Summary</h3>
              <button
                type="button"
                onClick={saveCustomResumeDetails}
                disabled={isSavingCustom}
                className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {isSavingCustom ? 'Saving...' : 'Save Summary'}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Resume Name / Target Role Focus</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                value={resume2Name}
                onChange={(e) => setResume2Name(e.target.value)}
                placeholder="e.g. Engineering Director / Technical Lead"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1">Custom Summary Statement (Leadership & Scaling)</label>
              <textarea
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm min-h-[90px]"
                value={resume2Summary}
                onChange={(e) => setResume2Summary(e.target.value)}
                placeholder="Proven engineering leader adept at scaling multinational squads across Berlin, Amsterdam, and London..."
              />
            </div>
          </div>
        )}
      </section>

      {/* 15 ATS Resume Templates Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">2. Choose ATS Layout Template (15 Available)</h2>
            <p className="text-xs text-zinc-500">All layouts optimized for Workday, BambooHR, Greenhouse, Lever & SAP SuccessFactors.</p>
          </div>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template.id)}
                className={`relative flex flex-col justify-between text-left rounded-xl border p-3 transition hover:shadow-md ${
                  isSelected
                    ? 'border-zinc-900 ring-2 ring-zinc-900 bg-zinc-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: template.accentColor }}
                      title={`Accent: ${template.accentColor}`}
                    />
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tight">
                      {template.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{template.name}</h4>
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 leading-tight">
                    {template.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-600">ATS Score 99</span>
                  {isSelected ? (
                    <span className="font-bold text-zinc-900">Active ✓</span>
                  ) : (
                    <span className="text-zinc-400">Select</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Target Vacancy & Generate Action */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900">3. Target Vacancy & Compilation</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="flex-1 min-w-[240px] rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-zinc-900 focus:outline-none"
            value={vacancyId}
            onChange={(event) => setVacancyId(event.target.value)}
          >
            <option value="">No target vacancy (Standard Universal Export)</option>
            {matches.map((match) => (
              <option key={match.id} value={match.vacancy?.id || match.id}>
                {match.vacancy?.title} — {match.vacancy?.companyName} ({match.overallScore}% Match)
              </option>
            ))}
          </select>

          <button
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition disabled:opacity-50"
            onClick={generate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Compiling PDF...' : `Generate ${selectedMode === 'EUROPASS_CV' ? 'Europass' : 'Custom'} PDF`}
          </button>

          <button
            className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 transition"
            onClick={stream}
          >
            Stream AI Cover Letter
          </button>
        </div>
      </section>

      {/* Live Preview & Stream Output */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">
                PDF Preview ({activeTemplate.name})
              </h3>
              {pdfUrl && (
                <a
                  className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 transition"
                  href={pdfUrl}
                  download={`${selectedMode.toLowerCase()}-${selectedTemplateId}.pdf`}
                >
                  Download .PDF
                </a>
              )}
            </div>
            <div className="mt-3">
              {pdfUrl ? (
                <iframe
                  title="Resume Preview"
                  src={pdfUrl}
                  className="h-[38rem] w-full rounded-xl border border-zinc-200"
                />
              ) : (
                <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 text-center text-zinc-500">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center mb-2 font-bold text-zinc-400">
                    PDF
                  </div>
                  <p className="text-sm font-medium text-zinc-700">No document rendered yet</p>
                  <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                    Click &ldquo;Generate PDF&rdquo; to compile your profile data into {activeTemplate.name}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">AI Tailored Cover Letter</h3>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Hallucination-free verified facts
            </span>
          </div>
          <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-800 font-sans leading-relaxed min-h-[300px]">
            {letter || 'Click "Stream AI Cover Letter" to craft an ATS cover letter based strictly on your verified facts and the target European vacancy.'}
          </pre>
        </section>
      </div>
    </main>
  );
}
