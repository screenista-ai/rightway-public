import CountryFlag from '../components/CountryFlag';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillSwap from '../components/PillSwap.jsx';
import CareerJourneyScrollytelling from '../components/CareerJourneyScrollytelling.jsx';
import { surfaces } from '../lib/surfaces';
import {
  ArrowRight,
  Check,
  ChevronDown,
  XCircle,
  CheckCircle2,
  ShieldCheck,
  Send,
  Ban,
  MapPin,
  Globe2,
  Sparkles,
  FileCheck,
  Building2,
  Briefcase,
} from 'lucide-react';

const BLUE_CARD_FLOOR = 45300;

const COUNTRIES = [
  {
    name: 'Germany',
    code: 'de',
    blurb: 'Blue Card rules, degree recognition and the tech hubs hiring from abroad.',
    flag: '🇩🇪',
  },
  {
    name: 'Netherlands',
    code: 'nl',
    blurb: 'Highly skilled migrant route and what employers must do to sponsor.',
    flag: '🇳🇱',
  },
  {
    name: 'Sweden',
    code: 'se',
    blurb: 'Work permit basics and the roles in demand.',
    flag: '🇸🇪',
  },
  {
    name: 'France',
    code: 'fr',
    blurb: 'Talent visas, language expectations and where to look.',
    flag: '🇫🇷',
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
    bots: 'AI fills gaps with hallucinations',
    agencies: 'Depends on the consultant',
    rightway: 'Only verified facts from documents',
  },
  {
    label: 'Visa check',
    bots: 'Rarely / Never',
    agencies: 'Yes, manually and slowly',
    rightway: 'Before every application, automated',
  },
  {
    label: 'Who sends',
    bots: 'The bot from blacklisted IP',
    agencies: 'The agency with 20% commission',
    rightway: 'You, from your own authenticated mailbox',
  },
  {
    label: 'Cost',
    bots: 'Subscription',
    agencies: 'Often high upfront fee or commission',
    rightway: 'Free to start, flat plans',
  },
];

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
    <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm text-left">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-950">
            Does your offer clear the European Blue Card floor?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            Try it now, no account needed. Evaluated against official European immigration thresholds.
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Instant Check
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold text-zinc-800">Are you an EU/EEA/Swiss citizen?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEuCitizen(true)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
            euCitizen === true
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          Yes, EU Citizen
        </button>
        <button
          type="button"
          onClick={() => setEuCitizen(false)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
            euCitizen === false
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          No, Need Visa Sponsorship
        </button>
      </div>

      {euCitizen === false ? (
        <>
          <label className="mt-5 block text-xs font-semibold text-zinc-800">
            Offered or expected salary (€ per year gross) — Germany threshold benchmark
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="e.g. 52000"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none transition"
            />
            <div
              className={`sm:min-w-[12rem] rounded-2xl border px-4 py-2.5 text-sm font-semibold flex items-center justify-center ${statusClass}`}
            >
              {statusLabel}
            </div>
          </div>
        </>
      ) : (
        <div className={`mt-5 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${statusClass}`}>
          {statusLabel}
        </div>
      )}

      <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
        {euCitizen === null
          ? 'Answer the citizenship question above to test Blue Card feasibility.'
          : euCitizen === true
            ? 'EU/EEA/Swiss citizens enjoy full free movement rights without visa or salary minimum constraints.'
            : !salaryResult
              ? 'Enter an expected gross annual salary in Euros to check against the statutory Germany €45,300 benchmark.'
              : salaryResult.passes
                ? 'Offer clears the statutory Germany Blue Card threshold (€45,300 gross / year).'
                : 'Offer sits below the general Blue Card threshold. (May still qualify under STEM shortage routes at €41,041).'}
      </p>

      {showSaveCta ? (
        <button
          type="button"
          onClick={saveLeadAndGo}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 cursor-pointer shadow-sm"
        >
          <span>Save this answer and build verified CV</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Does RightWay invent or hallucinate anything on my CV?',
      a: 'Never. Every skill, diploma, and employer is confirmed against documents you provide. Unverified claims cannot enter your CV.',
    },
    {
      q: 'Will it mass-spam companies on my behalf?',
      a: 'No. You approve every send. Applications leave from your own authenticated mailbox, capped at 15 a day.',
    },
    {
      q: 'Which European countries are supported?',
      a: 'Germany, the Netherlands, Sweden, France, and Ireland. Complete relocation guides with visa routes and salary minimums are available.',
    },
    {
      q: 'What does it cost to use RightWay?',
      a: 'Free to start! Test your resume with our ATS Checker, evaluate Blue Card feasibility, and browse verified jobs without entering a credit card.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10">
          {/* HERO SECTION */}
          <section className="mx-auto max-w-4xl px-3.5 sm:px-6 pt-8 sm:pt-14 pb-8 sm:pb-10 text-center md:pt-20 md:pb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>AI-Powered European Career Platform</span>
            </span>

            <h1 className="mt-5 text-3xl sm:text-5xl md:text-[3.4rem] font-bold tracking-tight text-zinc-950 leading-[1.15]">
              Apply to Europe with proof, not promises.
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed">
              Most job tools blast generic resumes. RightWay sends fewer, verified applications: every skill backed by proof, every visa rule pre-checked, sent directly from your own mailbox.
            </p>

            {/* PillSwap CTAs */}
            <PillSwap
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              defaultActive={0}
              itemClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <a href={surfaces.candidateRegister()}>
                <span>Find Jobs with Visa Sponsorship</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
              <Link to="/ats-checker">
                <FileCheck className="h-4 w-4 shrink-0" />
                <span>Free ATS Resume Checker</span>
              </Link>
            </PillSwap>

            {/* Quick Stats Pill */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>12,400+ Verified Jobs</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Blue Card Compliance</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>Direct Employer Inbox Delivery</span>
              </span>
            </div>

            {/* Blue Card Checker Widget */}
            <div className="mt-12 text-left">
              <BlueCardChecker />
            </div>
          </section>

          {/* REJECTED VS RIGHTWAY (WHY SECTION) */}
          <section className="mx-auto max-w-5xl px-4 py-16 border-t border-zinc-200/80">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
                Why good candidates get rejected in Europe
              </h2>
              <p className="text-sm sm:text-base text-zinc-600">
                European recruiters spot bot-written, hallucinated CVs in seconds. Here is the difference RightWay delivers.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-red-200/80 bg-white p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900">Generic Auto-Apply Bots</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                    <XCircle className="h-3.5 w-3.5" />
                    Instant Rejection
                  </span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
                  <li className="flex gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Hallucinates skills and fake responsibilities to game keyword filters</span>
                  </li>
                  <li className="flex gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Claims fluent German/French without certificates</span>
                  </li>
                  <li className="flex gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Blasts 100+ generic emails causing domain blacklist</span>
                  </li>
                  <li className="flex gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Applies to companies that cannot sponsor visas</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-emerald-200/80 bg-white p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900">A RightWay Verified Application</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    High Recruiter Trust
                  </span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
                  <li className="flex gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Only documented facts you confirmed, backed by degree proof</span>
                  </li>
                  <li className="flex gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Language proficiencies verified against official CEFR levels</span>
                  </li>
                  <li className="flex gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tailored submissions sent from your real personal mailbox</span>
                  </li>
                  <li className="flex gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Salary and legal visa sponsorship checked before drafting</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/why-rightway"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
              >
                <span>Read detailed platform comparison</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          {/* INTERACTIVE SCROLLYTELLING ANIMATION */}
          <CareerJourneyScrollytelling audience="both" />

          {/* COUNTRIES PREVIEW */}
          <section className="mx-auto max-w-5xl px-4 py-16 border-t border-zinc-200/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  Target Top European Tech Markets
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Practical visa routes, salary floors, and hiring standards across Europe.
                </p>
              </div>
              <Link
                to="/countries"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-700 transition"
              >
                <span>View all relocation guides</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNTRIES.map((c) => (
                <Link
                  key={c.name}
                  to="/countries"
                  className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:shadow-md transition space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <CountryFlag code={c.code || c.name} className="h-6 w-8 rounded shadow-xs border border-zinc-200" />
                    <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-900 transition flex items-center gap-1">
                      <span>Guide</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-950">{c.name}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{c.blurb}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* THREE PROMISES */}
          <section className="mx-auto max-w-5xl px-4 py-16 border-t border-zinc-200/80">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Three Core Guarantees
              </h2>
              <p className="text-sm text-zinc-600">The design principles behind RightWay AI.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROMISES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-zinc-950">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{p.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FOR EMPLOYERS BANNER */}
          <section className="mx-auto max-w-5xl px-4 py-16 border-t border-zinc-200/80">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-950 text-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-[11px] font-semibold text-zinc-300">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>RightWay for Employers</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                  Hiring international tech talent in Europe?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Publish openings with sponsorship criteria and meet senior engineers whose degrees, tenure, and visa requirements are verified upfront. Zero agency markups.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/employers"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition shadow-sm"
                >
                  <span>Explore Employer Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto max-w-3xl px-4 py-16 border-t border-zinc-200/80">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-500">Everything you need to know before you start.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-zinc-950"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* BOTTOM CTA */}
          <section className="mx-auto max-w-5xl px-4 pb-20">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 text-center shadow-sm space-y-6">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
                Your first step costs nothing.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                Run the free ATS check or create an account to start building a verified profile for European employers.
              </p>
              <PillSwap
                className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
                defaultActive={0}
                itemClassName="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full border px-6 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <a href={surfaces.candidateRegister()}>
                  <span>Start Free Account</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
                <Link to="/ats-checker">
                  <Globe2 className="h-4 w-4 shrink-0" />
                  <span>Free ATS Resume Check</span>
                </Link>
              </PillSwap>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
