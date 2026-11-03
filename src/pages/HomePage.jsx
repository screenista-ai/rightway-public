import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import PillSwap from '../components/PillSwap.jsx';
import { surfaces } from '../lib/surfaces';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  XCircle,
  CheckCircle2,
  ShieldCheck,
  Send,
  Ban,
  MapPin,
  Globe2,
} from 'lucide-react';

const BLUE_CARD_FLOOR = 45300;

const NAV_SECTIONS = [
  { id: 'countries', label: 'Countries' },
  { id: 'why', label: 'Why RightWay' },
  { id: 'employers', label: 'Employers' },
];

const COUNTRIES = [
  {
    name: 'Germany',
    blurb: 'Blue Card rules, degree recognition and the tech hubs hiring from abroad.',
  },
  {
    name: 'Netherlands',
    blurb: 'Highly skilled migrant route and what employers must do to sponsor.',
  },
  {
    name: 'Sweden',
    blurb: 'Work permit basics and the roles in demand.',
  },
  {
    name: 'France',
    blurb: 'Talent visas, language expectations and where to look.',
  },
];

const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'Zero unverified facts, by design',
    body: 'If you haven’t confirmed it, it can’t appear on your CV. Empty fields stay empty.',
  },
  {
    icon: Send,
    title: 'You press send, never us',
    body: 'AI prepares. You approve. Applications go from your own mailbox, capped at 15 a day.',
  },
  {
    icon: Ban,
    title: 'No wasted applications',
    body: 'If you need a visa, we check salary floors and sponsorship first. EU/EEA/Swiss citizens skip that gate.',
  },
];

const COMPARE_ROWS = [
  {
    label: 'CV accuracy',
    bots: 'AI fills gaps',
    agencies: 'Depends on the consultant',
    rightway: 'Only verified facts',
  },
  {
    label: 'Visa check',
    bots: 'Rarely',
    agencies: 'Yes, manually',
    rightway: 'Before every application, if you need a visa',
  },
  {
    label: 'Who sends',
    bots: 'The bot',
    agencies: 'The agency',
    rightway: 'You, from your mailbox',
  },
  {
    label: 'Cost',
    bots: 'Subscription',
    agencies: 'Often a fee or commission',
    rightway: 'Free to start, flat plans',
  },
];

function SurfaceLink({ href, className, children, ...rest }) {
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

function BlueCardChecker() {
  const [euCitizen, setEuCitizen] = useState(null); // null | true | false
  const [raw, setRaw] = useState('');

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

  const statusLabel = (() => {
    if (euCitizen === null) return 'One question first';
    if (euCitizen === true) return 'No Blue Card needed';
    if (!salaryResult) return 'Waiting for a number';
    return salaryResult.passes
      ? `Clears €${BLUE_CARD_FLOOR.toLocaleString('en-US')}`
      : `Below €${BLUE_CARD_FLOOR.toLocaleString('en-US')}`;
  })();

  const statusClass = (() => {
    if (euCitizen === null) return 'border-zinc-200 bg-zinc-50 text-zinc-400';
    if (euCitizen === true) return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    if (!salaryResult) return 'border-zinc-200 bg-zinc-50 text-zinc-400';
    return salaryResult.passes
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-700';
  })();

  const showSaveCta =
    euCitizen === true || (euCitizen === false && salaryResult !== null);

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
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm text-left">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
            Does your offer clear the Blue Card floor?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Try it now, no account needed. Same rule as the candidate portal.
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
          Lead check
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-zinc-700">Are you an EU/EEA/Swiss citizen?</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEuCitizen(true)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
            euCitizen === true
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setEuCitizen(false)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
            euCitizen === false
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          No
        </button>
      </div>

      {euCitizen === false ? (
        <>
          <label className="mt-5 block text-xs font-medium text-zinc-700">
            Offered salary (€ per year) — Germany, gross
          </label>
          <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="e.g. 52000"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
            <div
              className={`sm:min-w-[11rem] rounded-xl border px-3.5 py-2.5 text-sm font-semibold flex items-center justify-center ${statusClass}`}
            >
              {statusLabel}
            </div>
          </div>
        </>
      ) : (
        <div className={`mt-5 rounded-xl border px-3.5 py-2.5 text-sm font-semibold ${statusClass}`}>
          {statusLabel}
        </div>
      )}

      <p className="mt-2 text-[11px] text-zinc-400">
        {euCitizen === null
          ? 'Answer the citizenship question to continue.'
          : euCitizen === true
            ? 'EU/EEA/Swiss free movement — no Blue Card salary floor on this path. This is not a visa eligibility decision.'
            : !salaryResult
              ? 'Type a salary to see the Germany floor check (not a full Blue Card eligibility result).'
              : salaryResult.passes
                ? 'Offer clears the Germany floor shown here. Confirm on the official source; salary alone is not full Blue Card eligibility.'
                : 'Offer sits under the Germany floor shown here. Confirm on the official source; salary alone is not full Blue Card eligibility.'}{' '}
        {euCitizen === false
          ? `Uses the €${BLUE_CARD_FLOOR.toLocaleString('en-US')} floor shown on RightWay. Thresholds change yearly. `
          : null}
        Claim is stored only when you create an account (session lead, not URL). Unverified until passport/ID is verified.
      </p>

      {showSaveCta ? (
        <button
          type="button"
          onClick={saveLeadAndGo}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 cursor-pointer"
        >
          <span>Save this answer and create account</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const ids = [...NAV_SECTIONS.map((s) => s.id), 'faq'];

    function syncActiveSection() {
      const marker = window.scrollY + 120;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= marker) current = id;
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    }

    window.addEventListener('scroll', syncActiveSection, { passive: true });
    syncActiveSection();
    return () => window.removeEventListener('scroll', syncActiveSection);
  }, []);

  const faqs = [
    {
      q: 'Does RightWay invent anything on my CV?',
      a: 'No. Every skill, degree, and employer must be confirmed by you. Unverified claims cannot enter the CV. Empty fields stay empty.',
    },
    {
      q: 'Will it spam companies for me?',
      a: 'No. You approve every send. Applications leave from your own mailbox, capped at 15 a day.',
    },
    {
      q: 'Which countries are covered?',
      a: 'Start with Germany, the Netherlands, Sweden and France. Guides cover visa routes, salary floors and how hiring works in each market.',
    },
    {
      q: 'What does it cost?',
      a: 'Public beta. Free to start, no credit card. Flat candidate and employer plans when you need more volume.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-3 sm:px-4">
        <div className="glass-card relative flex items-center justify-between gap-2 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-sm border border-zinc-200/80">
          <Link to="/" className="flex items-center gap-2 font-medium tracking-tight shrink-0 z-10">
            <Logo className="h-7 w-7 text-sm" />
            <span className="font-semibold text-sm sm:text-base text-zinc-900">RightWay AI</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600 absolute left-1/2 -translate-x-1/2">
            {NAV_SECTIONS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`transition hover:text-zinc-900 ${
                    isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-600'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-2 text-zinc-700 cursor-pointer transition hover:bg-zinc-50 active:scale-95"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="lg:hidden mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur p-3 shadow-lg">
            <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
              {NAV_SECTIONS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`rounded-xl px-3 py-2.5 cursor-pointer transition hover:bg-zinc-50 ${
                      isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center md:pt-24 md:pb-14">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-600 shadow-sm">
            Public beta. Free to start, no credit card.
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-[3.25rem] font-semibold tracking-tight text-zinc-950 leading-[1.1]">
            Apply to Europe with proof, not promises.
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed">
            Most job tools send more applications. RightWay sends fewer, better ones: every CV fact verified, every
            visa rule checked first, nothing sent without your approval.
          </p>

          <PillSwap
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
            defaultActive={0}
            itemClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition cursor-pointer"
          >
            <a href={surfaces.candidateRegister()}>
              <span>I’m job hunting in Europe</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
            <a href={surfaces.recruiterRegister()}>
              <span>I’m hiring</span>
            </a>
          </PillSwap>

          <div className="mt-10 text-left">
            <BlueCardChecker />
          </div>
        </section>

        {/* REJECTED VS RIGHTWAY */}
        <section id="why" className="mx-auto max-w-5xl px-4 py-14 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              Why good candidates get rejected in Europe
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600">
              European recruiters can spot a bot-written, keyword-stuffed application in seconds. Here is the
              difference a recruiter sees.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">A typical auto-apply tool</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                  <XCircle className="h-3.5 w-3.5" />
                  Rejected
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Led a team of 12 engineers (never happened)</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Fluent German (A2 on paper)</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Sent to 140 companies in one day</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Role needs a visa the company doesn’t sponsor</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">A RightWay application</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Reads as credible
                </span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Only facts you confirmed, side by side with your documents</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Language level matched to your certificate</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>A few targeted applications a day, from your own mailbox</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Salary and sponsorship checked before anything is drafted</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* COUNTRIES */}
        <section id="countries" className="mx-auto max-w-5xl px-4 py-14 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              Start with the country, not the CV
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-600">
              Plain-language guides to visa routes, salary floors and how hiring really works in each market.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COUNTRIES.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-semibold text-zinc-950">{c.name}</h3>
                </div>
                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{c.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* THREE PROMISES */}
        <section className="mx-auto max-w-5xl px-4 py-14 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              Three promises we can’t break
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROMISES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-950">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="mx-auto max-w-5xl px-4 py-14 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              How RightWay compares
            </h2>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200/90 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 font-semibold"> </th>
                  <th className="px-4 py-3 font-semibold">Auto-apply bots</th>
                  <th className="px-4 py-3 font-semibold">Relocation agencies</th>
                  <th className="px-4 py-3 font-semibold text-zinc-900">RightWay</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3.5 font-medium text-zinc-800 whitespace-nowrap">{row.label}</td>
                    <td className="px-4 py-3.5 text-zinc-500">{row.bots}</td>
                    <td className="px-4 py-3.5 text-zinc-500">{row.agencies}</td>
                    <td className="px-4 py-3.5 font-medium text-zinc-900">{row.rightway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* EMPLOYER BANNER */}
        <section id="employers" className="mx-auto max-w-5xl px-4 py-14 border-t border-zinc-200/80">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-950 text-white p-7 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Hiring international tech talent?
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
              Publish roles with sponsorship flags and meet candidates whose skills and degrees are already verified.
              No agency markup.
            </p>
            <SurfaceLink
              href={surfaces.recruiterRegister()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              <span>Create employer account</span>
              <ArrowRight className="h-4 w-4" />
            </SurfaceLink>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-14 border-t border-zinc-200/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
              Questions before you start
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-zinc-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed">{faq.a}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 text-center shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
              Your first step costs nothing.
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Run the free ATS check or create an account to start building a verified profile.
            </p>
            <PillSwap
              className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              defaultActive={0}
              itemClassName="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition cursor-pointer"
            >
              <a href={surfaces.candidateRegister()}>
                <span>Start Applying Free</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
              <a href={surfaces.candidateAts()}>
                <Globe2 className="h-4 w-4 shrink-0" />
                <span>Free ATS resume check</span>
              </a>
            </PillSwap>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-7 w-7 text-sm" />
                <span className="font-semibold text-base text-zinc-900">RightWay AI</span>
              </Link>
              <p className="mt-3 text-xs text-zinc-500 max-w-sm leading-relaxed">
                © 2026 RightWay AI. Built with Right Way Immigration Consultant.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-600">
              <SurfaceLink href={surfaces.candidateLogin()} className="hover:text-zinc-900 transition">
                Candidate sign in
              </SurfaceLink>
              <SurfaceLink href={surfaces.recruiterLogin()} className="hover:text-zinc-900 transition">
                Employer sign in
              </SurfaceLink>
              <Link to="/legal/gdpr-privacy" className="hover:text-zinc-900 transition">
                Privacy
              </Link>
              <Link to="/legal/terms" className="hover:text-zinc-900 transition">
                Terms
              </Link>
              <a href="#faq" className="hover:text-zinc-900 transition">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
