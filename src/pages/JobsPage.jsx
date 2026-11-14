import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Marquee from '../components/Marquee';
import Reveal from '../components/Reveal';
import { surfaces } from '../lib/surfaces';
import { API_URL } from '../lib/api';
import { isBlueCardEligible } from '../config/blueCard';
import {
  Search,
  MapPin,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

const COUNTRY_MAP = {
  All: '',
  Germany: 'DE',
  Netherlands: 'NL',
  Sweden: 'SE',
  France: 'FR',
  Ireland: 'IE',
  Poland: 'PL',
  Spain: 'ES',
  'United States': 'US',
  Canada: 'CA',
  Australia: 'AU',
  'New Zealand': 'NZ',
};

const ISO_TO_COUNTRY = {
  DE: 'Germany',
  NL: 'Netherlands',
  SE: 'Sweden',
  FR: 'France',
  IE: 'Ireland',
  PL: 'Poland',
  ES: 'Spain',
  US: 'United States',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
};

const COUNTRIES = [
  'All',
  'Germany',
  'Netherlands',
  'Sweden',
  'France',
  'Ireland',
  'Poland',
  'Spain',
  'United States',
  'Canada',
  'Australia',
  'New Zealand',
];

const MARKET_MARQUEE = [
  'Germany',
  'Netherlands',
  'Sweden',
  'France',
  'Ireland',
  'United States',
  'Canada',
  'Australia',
  'New Zealand',
  'Remote',
];

function formatPostingDate(dateStr) {
  if (!dateStr) return 'Recently';
  const ms = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 30)} mo ago`;
}

function formatSalary(min, max) {
  if (!min && !max) return 'Salary on request';
  if (min && max) return `€${min.toLocaleString()} – €${max.toLocaleString()}`;
  if (min) return `From €${min.toLocaleString()}`;
  return `Up to €${max.toLocaleString()}`;
}

function JobDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const long = text.length > 280;
  return (
    <div className="space-y-1">
      <p className={`text-xs text-[var(--rw-muted)] leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
        {text}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-semibold text-[var(--rw-ink)] hover:text-orange-600 transition cursor-pointer"
        >
          {expanded ? 'Show less' : 'Show full description'}
        </button>
      ) : null}
    </div>
  );
}

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL query string
  const initialPage = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
  const initialCountryIso = (searchParams.get('country') || '').toUpperCase();
  const initialCountry = ISO_TO_COUNTRY[initialCountryIso] || 'All';
  const initialQ = searchParams.get('q') || '';
  const initialVisa = searchParams.get('visa') === 'true';
  const requestedJobId = searchParams.get('job') || searchParams.get('id');

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [onlySponsored, setOnlySponsored] = useState(initialVisa);
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1, page: initialPage, limit: 20 });
  const [byCountry, setByCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expiredNotice, setExpiredNotice] = useState(null);

  // Sync debounced search with 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Keep page and filters synced with URL search params so refresh/back works
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    const iso = COUNTRY_MAP[selectedCountry];
    if (iso) params.set('country', iso);
    if (debouncedQ) params.set('q', debouncedQ);
    if (onlySponsored) params.set('visa', 'true');
    if (requestedJobId) params.set('job', requestedJobId);

    setSearchParams(params, { replace: true });
  }, [page, debouncedQ, selectedCountry, onlySponsored, requestedJobId, setSearchParams]);

  // Check specific requested job for 410 expired status
  useEffect(() => {
    if (!requestedJobId) return;
    fetch(`${API_URL}/jobs/${requestedJobId}`)
      .then(async (res) => {
        if (res.status === 410) {
          const body = await res.json();
          setExpiredNotice(body);
        }
      })
      .catch(() => {});
  }, [requestedJobId]);

  // Server-side query
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), limit: '20', stats: '1' });

    const iso = COUNTRY_MAP[selectedCountry];
    if (iso) params.set('country', iso);
    if (debouncedQ) params.set('q', debouncedQ);
    if (onlySponsored) params.set('visa', 'true');

    setLoading(true);
    setError('');

    fetch(`${API_URL}/jobs/europe?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          if (json.byCountry && typeof json.byCountry === 'object') {
            setByCountry(json.byCountry);
          }
          setLoading(false);

          // Pagination clamping: if current page is beyond totalPages, clamp to last valid page
          if (json.totalPages > 0 && page > json.totalPages) {
            setPage(json.totalPages);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[JobsPage] Fetch failed:', err);
          setError(err.message || 'Failed to load vacancies');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, selectedCountry, debouncedQ, onlySponsored]);

  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent)] selection:text-white flex flex-col justify-between">

      <div>
        <Navbar />

        <div className="rw-page-hero">
          <div className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rw-accent)]/30 bg-[var(--rw-accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--rw-accent)] shadow-sm rw-hero-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live jobs · EU + US / CA / AU / NZ</span>
            </span>
            <h1 className="text-[clamp(1.75rem,4.5vw,3rem)] font-display font-bold tracking-tight text-[var(--rw-ink)] leading-tight rw-hero-in rw-hero-in-delay-1">
              Find jobs with visa checks
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-[var(--rw-muted)] leading-relaxed max-w-2xl mx-auto rw-hero-in rw-hero-in-delay-2">
              Roles across Europe and target markets. Apply with a profile employers can trust.
            </p>
            <div className="pt-2 rw-hero-in rw-hero-in-delay-3">
              <Marquee
                items={MARKET_MARQUEE}
                speed={28}
                className="py-3"
                itemClassName="text-lg sm:text-2xl text-[var(--rw-accent)]/50"
              />
            </div>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-14 sm:pb-20 space-y-6 sm:space-y-8">

          {/* Expired Job Notice (HTTP 410) */}
          {expiredNotice && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-900">
                    This job is no longer available
                  </h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    <strong>{expiredNotice.job?.title}</strong> at {expiredNotice.job?.companyName} ({expiredNotice.job?.country}) has closed or expired.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpiredNotice(null)}
                  className="text-xs text-amber-700 hover:text-amber-900 font-semibold"
                >
                  Dismiss
                </button>
              </div>

              {expiredNotice.similarJobs?.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60">
                  <p className="text-xs font-semibold text-amber-900 mb-2">Similar live positions:</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {expiredNotice.similarJobs.map((sim) => (
                      <div key={sim.id} className="rounded-xl bg-[var(--rw-surface)] p-3 border border-amber-100 text-xs shadow-2xs">
                        <p className="font-semibold text-[var(--rw-ink)] truncate">{sim.title}</p>
                        <p className="text-[var(--rw-muted)] text-[11px] mt-0.5 truncate">{sim.companyName} • {sim.country}</p>
                        <a
                          href={surfaces.candidateRegister({ vacancyId: sim.id })}
                          className="inline-flex items-center gap-1 text-orange-600 font-medium text-[11px] mt-1.5 hover:underline"
                        >
                          <span>Apply</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search & Filters */}
          <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative w-full flex-1 min-w-0">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--rw-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by job title, tech stack (e.g. React, Rust) or company…"
                  className="w-full rounded-xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)]/60 pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[var(--rw-ink)] outline-none focus:border-[var(--rw-ink)] focus:bg-[var(--rw-surface)] transition"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setOnlySponsored((v) => !v);
                  setPage(1);
                }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold transition shrink-0 cursor-pointer ${
                  onlySponsored
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-[var(--rw-line)] bg-[var(--rw-surface)] text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="whitespace-nowrap">Confirmed Visa Sponsorship Only</span>
              </button>
            </div>

            {/* Country Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2.5 sm:pt-3 border-t border-[var(--rw-line)] text-xs">
              <span className="text-[var(--rw-muted)] font-medium mr-1 flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
                <MapPin className="h-3.5 w-3.5" /> Destination:
              </span>
              {COUNTRIES.map((c) => {
                const iso = COUNTRY_MAP[c];
                const count =
                  c === 'All'
                    ? Object.values(byCountry).reduce((n, v) => n + (Number(v) || 0), 0)
                    : Number(byCountry[iso] || 0);
                return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setPage(1);
                  }}
                  className={`rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    selectedCountry === c
                      ? 'bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-2xs'
                      : 'bg-[var(--rw-paper-deep)] text-[var(--rw-muted)] hover:bg-[var(--rw-surface)] hover:text-[var(--rw-ink)]'
                  }`}
                >
                  {c}
                  {Object.keys(byCountry).length > 0 ? (
                    <span className="ml-1 opacity-70 tabular-nums">{count}</span>
                  ) : null}
                </button>
                );
              })}
            </div>
          </div>

          {/* Job Results Count Bar */}
          <div className="flex items-center justify-between text-xs text-[var(--rw-muted)] px-1">
            <span>
              {loading
                ? 'Searching vacancies…'
                : `Showing ${data.items.length} of ${data.total} live openings`}
            </span>
            <span className="flex items-center gap-1 text-[var(--rw-accent)] font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" /> Live board
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-[var(--rw-ink)]" />
              <p className="text-sm font-medium text-[var(--rw-muted)]">Loading verified jobs…</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
              <h3 className="text-base font-semibold text-red-900">Failed to load vacancies</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
              <button
                type="button"
                onClick={() => setPage((p) => p)}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && data.items.length === 0 && (
            <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-12 text-center space-y-3">
              <Briefcase className="h-10 w-10 text-[var(--rw-muted)] mx-auto opacity-40" />
              <h3 className="text-base font-semibold text-[var(--rw-ink)]">No live roles here</h3>
              <p className="text-xs text-[var(--rw-muted)] max-w-md mx-auto">
                {selectedCountry !== 'All' && Number(byCountry[COUNTRY_MAP[selectedCountry]] || 0) === 0
                  ? `${selectedCountry} has 0 live jobs right now. Pick All or another market with a count.`
                  : 'No vacancies matched these filters. Widen search or clear visa-only.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCountry('All');
                  setOnlySponsored(false);
                  setPage(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] px-4 py-2 text-xs font-semibold text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] transition"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Job Cards Grid */}
          {!loading && !error && data.items.length > 0 && (
            <div className="space-y-4">
              {data.items.map((job, idx) => {
                const jobId = job.id || job._id;
                const blueCardOk = isBlueCardEligible(job.country, job.salaryMin);
                const registerHref = surfaces.candidateRegister({ vacancyId: jobId });

                // Parse tags from comma-separated requirementsClean
                const tags = (job.requirementsClean || '')
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);

                return (
                  <Reveal
                    key={jobId}
                    delayMs={Math.min(idx * 40, 200)}
                    className="rounded-2xl border border-[var(--rw-line)] rw-surface rw-card-lift p-4 sm:p-6 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base sm:text-lg font-display font-bold text-[var(--rw-ink)] hover:text-[var(--rw-accent)] transition">
                            {job.title}
                          </h2>
                          {blueCardOk && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                              <ShieldCheck className="h-3 w-3" /> EU Blue Card Ready
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              Remote
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--rw-muted)]">
                          <span className="font-medium text-[var(--rw-muted)] flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {job.companyName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.city ? `${job.city}, ` : ''}{job.country}
                          </span>
                          <span>•</span>
                          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                          <span>•</span>
                          <span>{formatPostingDate(job.createdAt)}</span>
                        </div>
                      </div>

                      {/* Always RightWay apply funnel — no public source labels */}
                      <div className="shrink-0 pt-1 sm:pt-0">
                        <a
                          href={registerHref}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--rw-accent)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--rw-accent-2)] transition shadow-2xs rw-cta-nudge"
                        >
                          <span>Apply</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                    <JobDescription text={job.descriptionRaw} />

                    <div className="pt-2 border-t border-[var(--rw-line)] flex flex-wrap items-center gap-1.5 text-xs">
                      {tags.length > 0 ? (
                        tags.slice(0, 5).map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="rounded-md bg-[var(--rw-paper-deep)] px-2 py-0.5 text-[11px] font-medium text-[var(--rw-muted)]"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-[var(--rw-muted)]">General Technical Role</span>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] px-4 py-2 font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="font-medium text-[var(--rw-muted)]">
                Page <strong className="text-[var(--rw-ink)] font-bold">{page}</strong> of{' '}
                <strong className="text-[var(--rw-ink)] font-bold">{data.totalPages}</strong>
              </span>
              <button
                type="button"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="rounded-full border border-[var(--rw-line)] bg-[var(--rw-surface)] px-4 py-2 font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Bottom Banner — fixed dark panel; --rw-ink flips light in dark theme */}
          <div className="mt-8 sm:mt-12 rounded-2xl border border-zinc-800 bg-zinc-950 text-white p-6 sm:p-10 text-center space-y-3.5 sm:space-y-4">
            <h3 className="text-lg sm:text-2xl font-bold text-white">Want direct match alerts for your exact stack?</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Upload your resume, verify your facts, and apply from your RightWay candidate account. Markets: Europe, US, Canada, Australia, New Zealand.
            </p>
            <div className="pt-2">
              <a
                href={surfaces.candidateRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-100 transition shadow-sm"
              >
                <span>Create Free Candidate Profile</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
