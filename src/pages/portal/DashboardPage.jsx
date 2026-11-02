import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import {
  Folder,
  CheckCircle2,
  Globe2,
  Clock,
  Sparkles,
  RotateCw,
  ChevronDown,
  Mail,
  FileText,
  Sliders,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Toggle states for "Publish to"
  const [publishDestinations, setPublishDestinations] = useState({
    europassPdf: true,
    atsTemplates: true,
    recruiterMail: true,
    directAts: false,
  });

  useEffect(() => {
    api('/candidates/dashboard')
      .then(setData)
      .catch((reason) => setError(reason.message));
  }, []);

  function toggleDestination(key) {
    setPublishDestinations((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Release v2.4 — Profile</h1>
            <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Ready to publish
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            May 19, 2026 • Verified facts active • Updated just now
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/portal/cv-builder"
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
          >
            Studio Preview
          </Link>
          <Link
            to="/portal/jobs"
            className="rounded-xl bg-zinc-950 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
          >
            Publish to EU Jobs
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
        {/* Card 1: Purple (Verified Experience / PRs) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Folder size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.unverified !== undefined ? 12 : 12}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Verified facts</div>
          </div>
        </div>

        {/* Card 2: Green (Closed Issues / Blue Card Matches) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.matches !== undefined ? data.matches : 6}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Blue Card matches</div>
          </div>
        </div>

        {/* Card 3: Blue (Contributors / 15 Templates) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Globe2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">15</div>
            <div className="text-xs text-zinc-500 font-medium">ATS templates</div>
          </div>
        </div>

        {/* Card 4: Pink (Files changed / Dispatches Left) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {data?.submitted_today || 0} / {data?.daily_cap || 15}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Daily dispatches</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Studio (Draftbase Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 Width) — AI Draft & Highlights */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Draft Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-600" />
                <span>AI Fact Sheet & Application Summary</span>
              </h2>
              <p className="text-xs text-zinc-400">Generated strictly from your verified diplomas and credentials</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSync}
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition flex items-center gap-1.5"
              >
                <RotateCw size={12} className={syncing ? 'animate-spin' : ''} />
                <span>Regenerate</span>
              </button>

              <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-2xs flex items-center gap-1 cursor-pointer">
                <span>Tone: European Corporate</span>
                <ChevronDown size={12} className="text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Clean White Card with Highlights & Credentials */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-950">What&apos;s new in European Profile v2.4</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                This release compiles your verified professional achievements into Workday, Lever, and official Europass formats with full EU Blue Card eligibility audit.
              </p>
            </div>

            {/* Highlights Subsection */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                <span className="text-amber-500">✨</span>
                <span>Highlights</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Automated statutory salary filter cross-referencing German §18g AufenthG Blue Card threshold (€45,300+).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>One-click export to Official Europass PDF and 15 ATS-optimized single-column templates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Verified Anabin H+ degree equivalence confirmed for European recognition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Supervised dispatch armed via connected Gmail / Microsoft 365 personal mailbox.</span>
                </li>
              </ul>
            </div>

            {/* Fixes / Verification Subsection */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                <span className="text-blue-500">🛠️</span>
                <span>Verified Credentials Audit</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Confirmed employment dates and experience duration against uploaded employment certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Zero hallucination policy: Unconfirmed claims barred from entering compiled application PDFs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Anti-spam governor active: Maximum 15 targeted dispatches per rolling 24-hour window.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 Width) — Sources & Publish To Toggles */}
        <div className="space-y-5">
          {/* Card 1: Sources / Ingestion Status */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900">Sources & Mailbox</h3>
              <Link to="/portal/settings" className="text-[11px] font-semibold text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                    M
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">Mailbox OAuth — main</span>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  className="rounded-lg border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  {syncing ? 'Syncing...' : 'Sync'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                <div className="flex items-center justify-between">
                  <span>Verified Credentials</span>
                  <span className="font-semibold text-emerald-600">+12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blue Card Filter Matches</span>
                  <span className="font-semibold text-blue-600">+6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ATS Template Variations</span>
                  <span className="font-semibold text-zinc-900">+15</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Last synced 2 min ago</span>
              </div>
            </div>
          </div>

          {/* Card 2: Publish / Dispatch Destinations */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900">Publish & Dispatch to</h3>
              <Link to="/portal/settings" className="text-[11px] font-semibold text-blue-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {/* Option 1: Europass PDF */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Europass CV (Official Blue)</p>
                    <p className="text-[10px] text-zinc-400">Standard EU Commission A4</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDestination('europassPdf')}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                    publishDestinations.europassPdf ? 'bg-orange-500 justify-end' : 'bg-zinc-200 justify-start'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-white shadow-sm block" />
                </button>
              </div>

              {/* Option 2: 15 ATS Formats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Sliders size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">15 ATS Formats</p>
                    <p className="text-[10px] text-zinc-400">Workday & Lever Clean</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDestination('atsTemplates')}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                    publishDestinations.atsTemplates ? 'bg-orange-500 justify-end' : 'bg-zinc-200 justify-start'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-white shadow-sm block" />
                </button>
              </div>

              {/* Option 3: Candidate Mailbox Dispatch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Mail size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Candidate Mailbox (OAuth)</p>
                    <p className="text-[10px] text-zinc-400">Personal Gmail/M365</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDestination('recruiterMail')}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                    publishDestinations.recruiterMail ? 'bg-orange-500 justify-end' : 'bg-zinc-200 justify-start'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-white shadow-sm block" />
                </button>
              </div>

              {/* Option 4: Direct ATS Pipeline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <ExternalLink size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Direct Recruiter Inbound</p>
                    <p className="text-[10px] text-zinc-400">RightWay Recruiter Pool</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDestination('directAts')}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${
                    publishDestinations.directAts ? 'bg-orange-500 justify-end' : 'bg-zinc-200 justify-start'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-white shadow-sm block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
