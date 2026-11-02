import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function JobsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [autoApplyMinScore, setAutoApplyMinScore] = useState(85);
  const [autoBusy, setAutoBusy] = useState(false);
  const [autoMsg, setAutoMsg] = useState('');

  async function load() {
    const [matches, profile] = await Promise.all([
      api('/jobs/matches'),
      api('/candidates/profile'),
    ]);
    setItems(matches.items || []);
    setAutoApplyEnabled(Boolean(profile.autoApplyEnabled));
    setAutoApplyMinScore(profile.autoApplyMinScore ?? 85);
  }

  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, []);

  async function apply(vacancyId) {
    if (!vacancyId) {
      setError('Missing vacancy id');
      return;
    }
    setApplyingId(vacancyId);
    setError('');
    try {
      await api('/applications/approve', {
        method: 'POST',
        body: JSON.stringify({ vacancyId }),
      });
      navigate('/portal/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application submission failed');
    } finally {
      setApplyingId(null);
    }
  }

  async function saveAutoApply(nextEnabled, nextScore = autoApplyMinScore) {
    setError('');
    setAutoMsg('');
    try {
      const profile = await api('/candidates/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          autoApplyEnabled: nextEnabled,
          autoApplyMinScore: nextScore,
        }),
      });
      setAutoApplyEnabled(Boolean(profile.autoApplyEnabled));
      setAutoApplyMinScore(profile.autoApplyMinScore ?? 85);
      setAutoMsg('Auto-apply settings saved');
    } catch (err) {
      setError(err.message);
    }
  }

  async function runAutoApply() {
    setAutoBusy(true);
    setError('');
    setAutoMsg('');
    try {
      if (!autoApplyEnabled) {
        await saveAutoApply(true);
      }
      const result = await api('/applications/auto-apply', { method: 'POST', body: '{}' });
      const n = result.created?.length || 0;
      setAutoMsg(
        n > 0
          ? `Auto-applied to ${n} job(s) at ≥${result.minScore}% fit`
          : `No new jobs at ≥${result.minScore}% (or already applied / daily cap)`
      );
      if (n > 0) navigate('/portal/applications');
    } catch (err) {
      setError(err.message);
    } finally {
      setAutoBusy(false);
    }
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">Jobs</h1>
          <p className="mt-1 text-sm text-zinc-500">
            RightWay recruiter posts plus external feeds (Arbeitnow today). Apply manually or auto-apply by fit score.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">AI auto-apply</h2>
            <p className="text-xs text-zinc-500">
              Applies to hard-gate matches at or above your score. Daily cap 15. Uses verified profile facts only.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-800">
            <input
              type="checkbox"
              checked={autoApplyEnabled}
              onChange={(e) => saveAutoApply(e.target.checked)}
            />
            Enabled
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-zinc-600">
            Min fit score
            <input
              type="number"
              min={0}
              max={100}
              value={autoApplyMinScore}
              onChange={(e) => setAutoApplyMinScore(Number(e.target.value))}
              onBlur={() => saveAutoApply(autoApplyEnabled, autoApplyMinScore)}
              className="mt-1 block w-24 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={autoBusy}
            onClick={runAutoApply}
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
          >
            {autoBusy ? 'Running…' : 'Run auto-apply now'}
          </button>
        </div>
        {autoMsg ? <p className="text-xs text-emerald-700">{autoMsg}</p> : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="space-y-4">
        {items.map((item) => {
          const v = item.vacancy;
          const vacancyId = v?.id;
          const isRightWay = v?.source === 'DIRECT';
          return (
            <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        isRightWay
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {v?.sourceLabel || v?.source || 'External'}
                    </span>
                    {v?.visaSponsorshipAvailable ? (
                      <span className="text-[10px] font-semibold text-emerald-700">Visa sponsor</span>
                    ) : null}
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-900">{v?.title}</h2>
                  <p className="text-sm text-zinc-500">
                    {v?.companyName} • {v?.city ?? 'Remote'}, {v?.country}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {item.fitScore}% Match
                  </span>
                  <button
                    type="button"
                    disabled={!vacancyId || applyingId === vacancyId || !item.hardGatePassed}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-40"
                    onClick={() => apply(vacancyId)}
                  >
                    {applyingId === vacancyId ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600 sm:grid-cols-4">
                <div>
                  Skills: <strong className="text-zinc-900">{item.skillScore}%</strong>
                </div>
                <div>
                  Experience: <strong className="text-zinc-900">{item.experienceScore}%</strong>
                </div>
                <div>
                  Language: <strong className="text-zinc-900">{item.languageScore}%</strong>
                </div>
                <div>
                  Location: <strong className="text-zinc-900">{item.locationScore}%</strong>
                </div>
              </div>
              {!item.hardGatePassed ? (
                <p className="mt-2 text-xs text-amber-700">Hard gate failed — fix profile targets/visa before apply.</p>
              ) : null}
            </article>
          );
        })}
        {items.length === 0 && !error ? (
          <p className="text-sm text-zinc-500">
            No matches yet. Complete Master Profile and wait for feeds / RightWay posts.
          </p>
        ) : null}
      </div>
    </main>
  );
}
