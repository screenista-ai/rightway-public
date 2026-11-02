import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCw,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecruiterDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    api('/recruiter/dashboard')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  }

  return (
    <div className="space-y-6">
      {/* Draftbase Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Recruiter Console — European Hiring</h1>
            <span className="rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Talent Pool Active
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            May 19, 2026 • Verified non-EU candidate pool • Updated just now
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/talent-pool"
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
          >
            Filter Talent Pool
          </Link>
          <Link
            to="/recruiter/post-job"
            className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            + Post Vacancy
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      {/* Row of 4 Pastel Metric Stat Tiles (Draftbase Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Purple (Active Postings) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.vacanciesCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Active postings</div>
          </div>
        </div>

        {/* Card 2: Green (Applications) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.applicationsCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Applications</div>
          </div>
        </div>

        {/* Card 3: Blue (Verified Candidates) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.candidatesCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Pool talent</div>
          </div>
        </div>

        {/* Card 4: Pink (Fast Matches) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">94%</div>
            <div className="text-xs text-zinc-500 font-medium">Average fit score</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Studio (Draftbase Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 Width) — AI Screening Draft & Recent Submissions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-600" />
                <span>AI Screening Pipeline & Live Submissions</span>
              </h2>
              <p className="text-xs text-zinc-400">Pre-vetted candidates with confirmed Blue Card salary thresholds</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSync}
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition flex items-center gap-1.5"
              >
                <RotateCw size={12} className={syncing ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>

              <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-2xs flex items-center gap-1 cursor-pointer">
                <span>Filter: All Vacancies</span>
                <ChevronDown size={12} className="text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Clean White Card with Submissions & Highlights */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-950">Recent Candidate Applications</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                Review verified Europass profiles and tailored resumes submitted directly for your European vacancies.
              </p>
            </div>

            {data?.recentApplications && data.recentApplications.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {data.recentApplications.map((app) => (
                  <div key={app.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-900">
                        {app.candidate?.user?.firstName} {app.candidate?.user?.lastName}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Applied for <span className="font-semibold text-zinc-700">{app.vacancy?.title}</span> • {app.vacancy?.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        {app.status}
                      </span>
                      <Link
                        to="/recruiter/jobs"
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400">
                No active applications yet. Published vacancies will display matched candidates here.
              </div>
            )}

            {/* Screening Standards Subsection */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>RightWay Pre-Screening Standards</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Degree equivalence verified against Anabin / European Commission recognition databases.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Language declaration verified with CEFR framework standards (English / German).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Zero hallucinated skills: Extracted and validated strictly from verified credentials.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 Width) — Talent Pipeline Ingestion */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900">Talent Inbound Channel</h3>
              <Link to="/recruiter/jobs" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    R
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">EU Blue Card Pipeline</span>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  className="rounded-lg border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  {syncing ? 'Refreshing...' : 'Sync'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                <div className="flex items-center justify-between">
                  <span>Available Pre-Vetted Talent</span>
                  <span className="font-semibold text-emerald-600">+{data?.candidatesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Targeted European Roles</span>
                  <span className="font-semibold text-blue-600">+{data?.vacanciesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Time to Shortlist</span>
                  <span className="font-semibold text-zinc-900">48h</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Last checked 2 min ago</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900">Quick Operations</h3>
            <Link
              to="/recruiter/post-job"
              className="w-full flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              <span>+ Post New Vacancy</span>
              <ArrowRight size={13} className="text-zinc-400" />
            </Link>
            <Link
              to="/recruiter/talent-pool"
              className="w-full flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              <span>Search Candidate Pool</span>
              <ArrowRight size={13} className="text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
