import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';

const PIPE = ['APPLIED', 'SHORTLISTED', 'REJECTED'];

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [counts, setCounts] = useState({ APPLIED: 0, SHORTLISTED: 0, REJECTED: 0 });
  const [filter, setFilter] = useState('APPLIED');
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await api('/recruiter/jobs');
      setJobs(res.items || []);
      if (res.items?.length > 0) {
        selectJob(res.items[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function selectJob(job) {
    setSelectedJob(job);
    setLoadingApps(true);
    setError('');
    try {
      const res = await api(`/recruiter/jobs/${job.id}/applications`);
      setApps(res.items || []);
      setCounts(res.counts || { APPLIED: 0, SHORTLISTED: 0, REJECTED: 0 });
      setFilter('APPLIED');
    } catch (err) {
      setError(err.message);
      setApps([]);
    } finally {
      setLoadingApps(false);
    }
  }

  async function setPipeline(appId, pipelineStatus) {
    try {
      await api(`/recruiter/applications/${appId}/pipeline`, {
        method: 'PATCH',
        body: JSON.stringify({ pipelineStatus }),
      });
      if (selectedJob) await selectJob(selectedJob);
      const res = await api('/recruiter/jobs');
      setJobs(res.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = apps.filter((a) => a.pipelineStatus === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Posts</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Each vacancy shows Applied · Shortlisted · Rejected. Move candidates in the pipeline.
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          + Post vacancy
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">
            Posted ({jobs.length})
          </h2>
          {loading ? (
            <p className="text-xs text-zinc-400">Loading…</p>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-xs text-zinc-400">
              No jobs yet.{' '}
              <Link to="/recruiter/post-job" className="font-semibold text-zinc-900 underline">
                Post first vacancy
              </Link>
            </div>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const p = job.pipeline || job._count || {};
              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => selectJob(job)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <h3 className="text-sm font-bold text-zinc-900">{job.title}</h3>
                  <p className="text-xs text-zinc-500">
                    {job.companyName} · {job.country}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-1 border-t border-zinc-100 pt-2 text-center text-[10px] font-semibold">
                    <div>
                      <div className="text-base text-zinc-900">{p.applied ?? 0}</div>
                      Applied
                    </div>
                    <div>
                      <div className="text-base text-emerald-700">{p.shortlisted ?? 0}</div>
                      Shortlisted
                    </div>
                    <div>
                      <div className="text-base text-rose-700">{p.rejected ?? 0}</div>
                      Rejected
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {selectedJob ? (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">{selectedJob.title}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {selectedJob.companyName} · {selectedJob.country}
                  {selectedJob.city ? ` · ${selectedJob.city}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PIPE.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      filter === key
                        ? 'bg-zinc-900 text-white'
                        : 'border border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase()} ({counts[key] || 0})
                  </button>
                ))}
              </div>

              {loadingApps ? (
                <p className="text-xs text-zinc-400">Loading applications…</p>
              ) : visible.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
                  No candidates in {filter.toLowerCase()}.
                </div>
              ) : (
                <ul className="space-y-3">
                  {visible.map((app) => {
                    const c = app.candidate;
                    return (
                      <li
                        key={app.id}
                        className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              {c?.firstName} {c?.lastName}
                            </p>
                            <p className="text-xs text-zinc-500">{c?.email}</p>
                            <p className="mt-1 text-[10px] uppercase text-zinc-400">
                              {app.dispatchMode} · dispatch {app.status}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {PIPE.filter((p) => p !== app.pipelineStatus).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPipeline(app.id, p)}
                                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-100"
                              >
                                → {p.charAt(0) + p.slice(1).toLowerCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        {c?.skills?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {c.skills.map((s) => (
                              <span
                                key={s.id}
                                className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-700"
                              >
                                {s.skillName}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center text-sm text-zinc-400">
              Select a post to review Applied · Shortlisted · Rejected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
