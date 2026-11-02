import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
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
    setLoadingCandidates(true);
    try {
      const res = await api(`/recruiter/jobs/${job.id}/candidates`);
      setCandidates(res.items || []);
    } catch (err) {
      console.error(err);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Manage Vacancies & Matched Talent</h1>
          <p className="mt-1 text-sm text-zinc-500">
            View active job listings and inspect candidate compatibility scores.
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          + Post New Vacancy
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Postings List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Posted Positions ({jobs.length})</h2>
          {loading ? (
            <p className="text-xs text-zinc-400">Loading listings...</p>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-xs text-zinc-400">
              No jobs posted yet.{' '}
              <Link to="/recruiter/post-job" className="text-blue-600 font-semibold underline">
                Post your first vacancy
              </Link>
            </div>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <button
                  key={job.id}
                  onClick={() => selectJob(job)}
                  className={`w-full text-left rounded-2xl border p-4 transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                      {job.country} {job.city ? `• ${job.city}` : ''}
                    </span>
                    {job.visaSponsorshipAvailable && (
                      <span className="text-[10px] font-semibold text-emerald-600">Visa Sponsor</span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-zinc-900">{job.title}</h3>
                  <p className="text-xs text-zinc-500">{job.companyName}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                    <span>{job._count?.applications || 0} applicants</span>
                    <span className="font-medium text-blue-600">{job._count?.jobMatches || 0} pool matches</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Matched Candidates & Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedJob ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-zinc-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-zinc-900">{selectedJob.title}</h2>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {selectedJob.companyName} • {selectedJob.country} • {selectedJob.isRemote ? 'Remote EU' : 'On-site'} •{' '}
                  {selectedJob.salaryMin ? `€${selectedJob.salaryMin.toLocaleString()} - €${selectedJob.salaryMax?.toLocaleString() || ''}` : 'Competitive'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-3">
                  AI Matched Candidates ({candidates.length})
                </h3>

                {loadingCandidates ? (
                  <p className="text-xs text-zinc-400">Calculating compatibility scores...</p>
                ) : candidates.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
                    No candidate matches found in current matching pipeline yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidates.map((match) => {
                      const user = match.candidate?.user;
                      const skills = match.candidate?.skills || [];
                      return (
                        <div
                          key={match.id}
                          className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-2 hover:bg-zinc-50 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-zinc-900">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-xs text-zinc-500">{user?.email}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                {Math.round(match.fitScore * 100)}% Fit
                              </span>
                            </div>
                          </div>

                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {skills.slice(0, 6).map((s) => (
                                <span
                                  key={s.id}
                                  className="rounded-md bg-white border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-700"
                                >
                                  {s.skillName}
                                </span>
                              ))}
                              {skills.length > 6 && (
                                <span className="text-[10px] text-zinc-400 self-center">
                                  +{skills.length - 6} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500">
                            <span>Hard Gates: {match.hardGatePassed ? 'Passed ✓' : 'Review Needed'}</span>
                            <span className="text-blue-600 font-medium">ATS Verified Profile</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center text-zinc-400 text-sm">
              Select a vacancy from the left to inspect applicant matches and fit rankings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

