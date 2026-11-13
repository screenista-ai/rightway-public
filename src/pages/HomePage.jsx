import CountryFlag from '../components/CountryFlag';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillSwap from '../components/PillSwap.jsx';
import CareerJourneyScrollytelling from '../components/CareerJourneyScrollytelling.jsx';
import Marquee from '../components/Marquee';
import Reveal from '../components/Reveal';
import { surfaces } from '../lib/surfaces';
import { API_URL } from '../lib/api';
import {
  ArrowRight,
  ChevronDown,
  Briefcase,
  MapPin,
  Building2,
  Loader2,
} from 'lucide-react';

const BLUE_CARD_FLOOR = 45300;

const COUNTRIES = [
  {
    name: 'Germany',
    code: 'de',
    blurb: 'Blue Card rules, degree recognition and the tech hubs hiring from abroad.',
  },
  {
    name: 'Netherlands',
    code: 'nl',
    blurb: 'Highly skilled migrant route and what employers must do to sponsor.',
  },
  {
    name: 'Sweden',
    code: 'se',
    blurb: 'Work permit basics and the roles in demand.',
  },
  {
    name: 'France',
    code: 'fr',
    blurb: 'Talent visas, language expectations and where to look.',
  },
  {
    name: 'Ireland',
    code: 'ie',
    blurb: 'Critical Skills permits and English-speaking EU tech hubs.',
  },
  {
    name: 'United States',
    code: 'us',
    blurb: 'H-1B and specialty routes — check sponsor fit before you apply.',
  },
  {
    name: 'Canada',
    code: 'ca',
    blurb: 'Global Talent Stream and Express Entry for skilled tech roles.',
  },
  {
    name: 'Australia',
    code: 'au',
    blurb: 'TSS and skilled lists for software and cloud roles.',
  },
  {
    name: 'New Zealand',
    code: 'nz',
    blurb: 'Accredited employer visas and Green List pathways.',
  },
];

function BlueCardChecker() {
  const [euCitizen, setEuCitizen] = useState(null);
  const [pillHover, setPillHover] = useState(null);
  const [raw, setRaw] = useState('');

  const visualCitizen =
    pillHover === 'yes' ? true : pillHover === 'no' ? false : euCitizen;

  const salaryResult = useMemo(() => {
    const cleaned = String(raw).replace(/[^\d]/g, '');
    if (!cleaned) return null;
    const value = Number(cleaned);
    if (!Number.isFinite(value) || value <= 0) return null;
    return {
      value,
      passes: value >= BLUE_CARD_FLOOR,
    };
  }, [raw]);

  // Match live public: no status pills — feedback only in helper line below.
  const showSaveCta = euCitizen === true || (euCitizen === false && salaryResult !== null);

  function saveLeadAndGo(e) {
    e.preventDefault();
    if (euCitizen === null) return;
    const lead = {
      citizenshipClaim: euCitizen ? 'EU_EEA_CH' : 'NON_EU',
      desiredSalaryEur: !euCitizen && salaryResult ? salaryResult.value : null,
      at: Date.now(),
    };
    try {
      sessionStorage.setItem('rw_citizenship_lead', JSON.stringify(lead));
    } catch {
      /* ignore */
    }
    window.location.href = surfaces.candidateRegister();
  }

  return (
    <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-5 sm:p-8 text-left">
      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--rw-ink)] tracking-tight">
        Clear the Blue Card floor?
      </h3>
      <p className="mt-2 text-sm text-[var(--rw-muted)]">
        Free check · Germany €{BLUE_CARD_FLOOR.toLocaleString('en-US')} / year
      </p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rw-ink)]">
        EU / EEA / Swiss citizen?
      </p>
      <div
        className="mt-3 flex flex-wrap gap-2"
        onMouseLeave={() => setPillHover(null)}
      >
        <button
          type="button"
          onClick={() => setEuCitizen(true)}
          onMouseEnter={() => setPillHover('yes')}
          onFocus={() => setPillHover('yes')}
          onBlur={() => setPillHover(null)}
          className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold border transition duration-200 cursor-pointer ${
            visualCitizen === true
              ? 'border-transparent bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-sm'
              : 'bg-transparent text-[var(--rw-ink)] border-[var(--rw-line)]'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setEuCitizen(false)}
          onMouseEnter={() => setPillHover('no')}
          onFocus={() => setPillHover('no')}
          onBlur={() => setPillHover(null)}
          className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold border transition duration-200 cursor-pointer ${
            visualCitizen === false
              ? 'border-transparent bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-sm'
              : 'bg-transparent text-[var(--rw-ink)] border-[var(--rw-line)]'
          }`}
        >
          No — need sponsorship
        </button>
      </div>

      {euCitizen === false ? (
        <>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rw-ink)]">
            Expected salary (€ / year gross)
          </label>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="e.g. 52000"
              className="w-full rounded-xl border border-[rgba(10,10,10,0.12)] bg-transparent px-4 py-2.5 text-sm focus:border-[var(--rw-ink)] focus:outline-none transition"
            />
          </div>
        </>
      ) : null}

      <p className="mt-3 text-[11px] text-[var(--rw-muted)] leading-relaxed">
        {euCitizen === null
          ? 'Answer citizenship to test Blue Card feasibility.'
          : euCitizen === true
            ? 'EU/EEA/Swiss citizens have free movement — no Blue Card salary floor.'
            : !salaryResult
              ? 'Enter gross annual salary in euros.'
              : salaryResult.passes
                ? 'Clears the Germany Blue Card threshold (€45,300).'
                : 'Below general Blue Card floor. STEM shortage routes may still apply (€41,041).'}
      </p>

      {showSaveCta ? (
        <button
          type="button"
          onClick={saveLeadAndGo}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--rw-ink)] px-5 py-2.5 text-xs font-semibold text-[var(--rw-paper)] transition hover:bg-[var(--rw-accent)] cursor-pointer rw-cta-nudge"
        >
          <span>Save answer & continue</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function formatSalary(min, max) {
  if (!min && !max) return 'Salary on request';
  if (min && max) return `€${min.toLocaleString()} – €${max.toLocaleString()}`;
  if (min) return `From €${min.toLocaleString()}`;
  return `Up to €${max.toLocaleString()}`;
}

/** Round-robin pick so home strip is not all one country. */
function diversifyByCountry(items, limit = 6) {
  const buckets = new Map();
  for (const job of items) {
    const key = job.country || '??';
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(job);
  }
  const keys = [...buckets.keys()];
  const out = [];
  let i = 0;
  while (out.length < limit && keys.some((k) => buckets.get(k).length > 0)) {
    const key = keys[i % keys.length];
    const bucket = buckets.get(key);
    if (bucket.length) out.push(bucket.shift());
    i += 1;
  }
  return out;
}

function LiveJobsStrip() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetch(`${API_URL}/jobs/europe?page=1&limit=40&stats=1`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          const raw = Array.isArray(json.items) ? json.items : [];
          setItems(diversifyByCountry(raw, 6));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load jobs');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-8 py-24 sm:py-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--rw-muted)]">
            Live roles
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--rw-ink)]">
            Jobs across every market
          </h2>
          <p className="mt-3 text-sm text-[var(--rw-muted)] max-w-lg">
            Fresh board from Europe, US, Canada, Australia, and New Zealand.
          </p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rw-ink)] hover:text-[var(--rw-accent)] transition rw-cta-nudge"
        >
          <span>View all jobs</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[var(--rw-muted)]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading roles…</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-8 text-center text-sm text-[var(--rw-muted)]">
          Could not load jobs. Open the full board instead.
          <div className="mt-4">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--rw-ink)] px-5 py-2.5 text-xs font-semibold text-[var(--rw-paper)]"
            >
              Browse jobs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-8 text-center text-sm text-[var(--rw-muted)]">
          No live roles right now. Check back soon.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((job, idx) => {
            const jobId = job.id || job._id;
            return (
              <Reveal key={jobId} delayMs={Math.min(idx * 40, 160)}>
                <li className="rounded-2xl border border-[var(--rw-line)] rw-surface rw-card-lift p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <h3 className="font-display text-base sm:text-lg font-bold text-[var(--rw-ink)] truncate">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--rw-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.companyName}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.city ? `${job.city}, ` : ''}
                        {job.country}
                      </span>
                      <span>·</span>
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                  </div>
                  <a
                    href={surfaces.candidateRegister({ vacancyId: jobId })}
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--rw-ink)] px-4 py-2.5 text-xs font-semibold text-[var(--rw-paper)] hover:bg-[var(--rw-accent)] transition rw-cta-nudge"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Apply</span>
                  </a>
                </li>
              </Reveal>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Can anything fake get on my CV?',
      a: 'No. Skills and employers only appear after you confirm them from your documents.',
    },
    {
      q: 'Do you send applications for me?',
      a: 'No. You approve each one. Mail leaves your own inbox, max 15 a day.',
    },
    {
      q: 'Which countries?',
      a: 'Germany, Netherlands, Sweden, France, Ireland — plus US, Canada, Australia, New Zealand jobs.',
    },
    {
      q: 'What does it cost?',
      a: 'Free to start. No card for Blue Card check, profile, or browsing jobs.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--rw-paper)] text-[var(--rw-ink)] selection:bg-[var(--rw-accent)] selection:text-white flex flex-col justify-between">
      <div>
        {/* Sticky nav sits over hero; hero pulls up so gradient fills the strip behind the pill */}
        <Navbar />

        <main>
          {/* HERO */}
          <section className="rw-hero-bleed rw-hero-under-nav relative">
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-8 pt-16 sm:pt-24 pb-14 flex-1 flex flex-col justify-end">
              <p className="font-display rw-hero-brand font-extrabold text-[#f4f1ea] rw-hero-mark">
                RightWay
              </p>
              <div className="mt-8 sm:mt-10 max-w-xl">
                <h1 className="text-2xl sm:text-4xl font-display font-semibold tracking-tight text-[#f4f1ea] leading-[1.05] rw-hero-in rw-hero-in-delay-1 max-w-full">
                  Confirmed CV. You hit send.
                </h1>
                <p className="mt-4 text-sm sm:text-base text-[rgba(243,241,236,0.7)] leading-relaxed rw-hero-in rw-hero-in-delay-2 max-w-md">
                  Facts you locked in. Visa floors checked. Mail leaves your inbox.
                </p>
                <PillSwap
                  tone="inverse"
                  className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rw-hero-in rw-hero-in-delay-3"
                  defaultActive={0}
                  itemClassName="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-7 text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  <a href={surfaces.candidateRegister()} className="rw-cta-nudge">
                    <span>Find sponsored jobs</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                  <Link to="/jobs" className="rw-cta-nudge">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>Browse jobs</span>
                  </Link>
                </PillSwap>
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10">
              <Marquee
                items={[
                  'Germany',
                  'Netherlands',
                  'Sweden',
                  'France',
                  'United States',
                  'Canada',
                  'Australia',
                  'New Zealand',
                  'Blue Card',
                  'Verified CV',
                ]}
                speed={28}
                className="py-6 sm:py-8"
                itemClassName="text-4xl sm:text-6xl md:text-7xl text-[rgba(243,241,236,0.5)]"
                separator="—"
              />
              <Marquee
                items={[
                  'Visa checks',
                  'Your mailbox',
                  'Europass',
                  'Direct apply',
                  'Sponsorship first',
                  'Blue Card ready',
                ]}
                speed={40}
                reverse
                className="pb-6 sm:pb-8"
                itemClassName="text-lg sm:text-2xl text-[#34d399]"
                separator="·"
              />
              <div className="rw-rainbow-bar" />
            </div>
          </section>

          <div className="rw-paper-wash">
          {/* EDITORIAL PROOF */}
          <section className="mx-auto max-w-6xl px-4 sm:px-8 py-24 sm:py-32">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--rw-muted)]">
                The problem
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,6vw,3.75rem)] font-semibold tracking-tight text-[var(--rw-ink)] leading-[1.05]">
                Recruiters spot fake polish in seconds.
              </h2>
            </Reveal>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700/80">
                  The usual mess
                </p>
                <ul className="mt-5 space-y-4 text-sm sm:text-base text-[var(--rw-muted)] leading-relaxed">
                  <li className="border-t border-[var(--rw-line)] pt-4">Skills invented to pass filters</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Language claims with no proof</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Hundreds of generic blasts</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Roles that cannot sponsor</li>
                </ul>
              </Reveal>
              <Reveal delayMs={80}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--rw-accent)]">
                  With RightWay
                </p>
                <ul className="mt-5 space-y-4 text-sm sm:text-base text-[var(--rw-ink)] leading-relaxed">
                  <li className="border-t border-[var(--rw-line)] pt-4">Only facts you confirmed</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Language levels backed by certs</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Sent from your own mailbox</li>
                  <li className="border-t border-[var(--rw-line)] pt-4">Visa floor checked first</li>
                </ul>
              </Reveal>
            </div>

            <div className="mt-20">
              <BlueCardChecker />
            </div>

            <div className="mt-10">
              <Link
                to="/why-rightway"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rw-ink)] hover:text-[var(--rw-accent)] transition rw-cta-nudge"
              >
                <span>Full platform comparison</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* PATH SCRUB — candidate + recruiter */}
          <CareerJourneyScrollytelling audience="both" />

          <div className="rw-rainbow-bar" />

          {/* LIVE JOBS — same public API as /jobs */}
          <LiveJobsStrip />

          <div className="rw-rainbow-bar" />

          {/* MARKETS — list, not cards */}
          <section className="mx-auto max-w-6xl px-4 sm:px-8 py-24 sm:py-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--rw-muted)]">
                  Markets
                </p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--rw-ink)]">
                  Where you relocate
                </h2>
              </div>
              <Link
                to="/countries"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--rw-ink)] hover:text-[var(--rw-accent)] transition rw-cta-nudge"
              >
                <span>All guides</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="divide-y divide-[var(--rw-line)] border-y border-[var(--rw-line)]">
              {COUNTRIES.map((c) => (
                <li key={c.name}>
                  <Link
                    to="/countries"
                    className="group flex items-center gap-5 sm:gap-8 py-6 sm:py-8 hover:bg-[var(--rw-paper-deep)]/40 transition px-1"
                  >
                    <CountryFlag code={c.code} className="h-5 w-7 rounded-sm border border-[var(--rw-line)] shrink-0" />
                    <span className="font-display text-xl sm:text-3xl font-semibold text-[var(--rw-ink)] w-36 sm:w-48 shrink-0">
                      {c.name}
                    </span>
                    <span className="hidden sm:block text-sm text-[var(--rw-muted)] flex-1">{c.blurb}</span>
                    <ArrowRight className="h-4 w-4 text-[var(--rw-muted)] group-hover:text-[var(--rw-accent)] group-hover:translate-x-1 transition shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* EMPLOYERS */}
          <section className="rw-band-violet">
            <div className="mx-auto max-w-6xl px-4 sm:px-8 py-24 sm:py-28 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="max-w-xl space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                  Employers
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.05]">
                  Hire without the agency cut.
                </h2>
                <p className="text-sm text-white/65 leading-relaxed">
                  Post roles that can sponsor. Meet engineers with degrees, tenure, and visa fit already checked.
                </p>
              </div>
              <Link
                to="/employers"
                className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-[#2e1065] hover:bg-[#ede9fe] transition rw-cta-nudge shrink-0"
              >
                <span>Employer portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto max-w-3xl px-4 sm:px-8 py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--rw-muted)]">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--rw-ink)]">
              Straight answers
            </h2>
            <div className="mt-10 divide-y divide-[rgba(10,10,10,0.1)] border-y border-[rgba(10,10,10,0.1)]">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm sm:text-base font-semibold text-[var(--rw-ink)]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[var(--rw-muted)] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="pb-5 text-sm text-[var(--rw-muted)] leading-relaxed -mt-1">
                        {faq.a}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CLOSE CTA */}
          <section className="border-t border-[var(--rw-line)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-8 py-20 sm:py-28 text-center space-y-6">
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--rw-ink)]">
                First step costs nothing.
              </h2>
              <p className="text-sm text-[var(--rw-muted)] max-w-md mx-auto">
                Build a profile employers can trust — or browse sponsored roles now.
              </p>
              <PillSwap
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
                defaultActive={0}
                itemClassName="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border px-7 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <a href={surfaces.candidateRegister()}>
                  <span>Start free</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
                <Link to="/jobs">
                  <span>Browse jobs</span>
                </Link>
              </PillSwap>
            </div>
          </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
