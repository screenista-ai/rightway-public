import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, FileText, Folder, ShieldAlert } from 'lucide-react';
import { RESUME_TEMPLATES } from '@rightway/shared';
import { api } from '../../lib/api.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/candidates/dashboard')
      .then(setData)
      .catch((reason) => setError(reason.message));
  }, []);

  const tiles = [
    {
      label: 'Verified facts',
      value: data?.verified ?? '—',
      href: '/portal/profile',
      icon: Folder,
      tone: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      label: 'Needs verify',
      value: data?.unverified ?? '—',
      href: '/portal/profile',
      icon: ShieldAlert,
      tone: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      label: 'Blue Card matches',
      value: data?.matches ?? '—',
      href: '/portal/jobs',
      icon: CheckCircle2,
      tone: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      label: 'Applications',
      value: data?.applications ?? '—',
      href: '/portal/applications',
      icon: FileText,
      tone: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Daily dispatches',
      value: data
        ? `${data.submitted_today ?? 0} / ${data.daily_cap ?? 15}`
        : '—',
      href: '/portal/applications',
      icon: Clock,
      tone: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      label: 'ATS templates',
      value: RESUME_TEMPLATES.length,
      href: '/portal/resumes',
      icon: FileText,
      tone: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Overview</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Live counts from your profile, matches, and applications.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/portal/profile"
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Master Profile
          </Link>
          <Link
            to="/portal/jobs"
            className="rounded-xl bg-zinc-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            Browse Blue Card jobs
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              to={tile.href}
              className="flex items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition hover:border-zinc-300"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tile.tone}`}
              >
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-zinc-950">{tile.value}</div>
                <div className="text-xs font-medium text-zinc-500">{tile.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          to="/portal/resumes"
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          My Resumes
          <p className="mt-1 text-xs font-normal text-zinc-500">Templates, ATS score, tailor</p>
        </Link>
        <Link
          to="/portal/documents"
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          My Documents
          <p className="mt-1 text-xs font-normal text-zinc-500">Upload certificates & CV files</p>
        </Link>
        <Link
          to="/portal/settings"
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Mailbox settings
          <p className="mt-1 text-xs font-normal text-zinc-500">Google / Microsoft OAuth</p>
        </Link>
      </div>
    </div>
  );
}
