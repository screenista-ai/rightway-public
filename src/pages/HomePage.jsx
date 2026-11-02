import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import CareerJourneyScrollytelling from '../components/CareerJourneyScrollytelling';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Sliders,
  Check,
  Send,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'product', label: 'Product' },
  { id: 'how', label: 'How it works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [pricingAudience, setPricingAudience] = useState('candidate');
  const [openFaq, setOpenFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('match');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const ids = NAV_SECTIONS.map((s) => s.id);

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

  function setAudience(next) {
    setPricingAudience(next);
  }

  const faqs = [
    {
      q: 'How does RightWay prevent AI hallucinations on European CVs?',
      a: 'We use a strict deterministic extraction and verification loop. Every degree, employer, date range, and technical skill is extracted from your uploaded documents and requires your confirmation before it can be rendered onto an Europass CV. Empty fields remain empty; the model is programmatically barred from inventing experience.',
    },
    {
      q: 'Are the auto-applications compliant with EU GDPR and anti-spam regulations?',
      a: 'Yes. RightWay strictly operates under GDPR compliance with explicit user consent for each application batch. We enforce a daily hard ceiling of 15 applications per candidate (Mode A supervised dispatch) to protect domain reputation and comply with EU anti-spam standards.',
    },
    {
      q: 'How does the EU Blue Card and Visa Sponsorship gate work?',
      a: 'Our European vacancy engine cross-checks employer sponsorship histories, statutory salary minimums (e.g. German §18g AufenthG Blue Card thresholds), and degree equivalence. Roles without confirmed sponsorship or qualifying salaries are flagged and gated closed for non-EU candidates.',
    },
    {
      q: 'Can I review each cover letter and CV before sending?',
      a: 'Always. In Supervised Mode, nothing leaves your dashboard without your explicit one-click confirmation. You can inspect the split-screen diff of the tailored Europass PDF and edit cover letter paragraphs prior to dispatch.',
    },
    {
      q: 'Which European countries and tech markets are supported?',
      a: 'We actively scrape and index tech vacancies across Germany, Netherlands, Sweden, France, Ireland, Switzerland, Poland, and Austria, with multilingual support for English, German, and French application workflows.',
    },
    {
      q: 'What ATS and application channels does RightWay support?',
      a: 'RightWay connects via OAuth for candidate-owned email dispatches (Google Workspace & Microsoft 365) and supports automated form handling for major European ATS systems including Workday, Greenhouse, Lever, and Personio.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Background radial subtle grid */}
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      {/* Floating Navbar */}
      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-3 sm:px-4">
        <div className="glass-card flex items-center justify-between gap-2 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-sm border border-zinc-200/80">
          <Link to="/" className="flex items-center gap-2 font-medium tracking-tight shrink-0">
            <Logo className="h-7 w-7 text-sm" />
            <span className="font-semibold text-sm sm:text-base text-zinc-900">RightWay</span>
            <span className="hidden md:inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              EU Talent
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600">
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

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              to="/auth/login?role=candidate"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register?role=candidate"
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              <span className="hidden xs:inline sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-2 text-zinc-700"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
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
                    className={`rounded-xl px-3 py-2.5 hover:bg-zinc-50 ${
                      isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <div className="mt-2 border-t border-zinc-100 pt-2 grid grid-cols-1 gap-1.5">
              <Link to="/auth/login?role=candidate" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-zinc-900 px-3 py-2.5 text-center text-sm font-semibold text-white">Sign In</Link>
              <Link to="/auth/register?role=candidate" onClick={() => setMobileMenuOpen(false)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-center text-sm font-semibold text-zinc-800">Get Started</Link>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center md:pt-24 md:pb-16">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Now live for European tech hubs</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">Public Beta</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.15] px-1">
            European job applications that{' '}
            <span className="relative inline-block">write & send</span> themselves.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            RightWay transforms your verified credentials into compliant Europass CVs and precision
            applications. Zero hallucination, strict visa gating, and one-click supervised dispatch.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth/register?role=candidate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              <span>Start Applying Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/portal/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-300"
            >
              <Globe2 className="h-4 w-4 text-zinc-500" />
              <span>Explore 28,000+ EU Jobs</span>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-zinc-200/80 py-6">
            <div>
              <div className="text-2xl font-semibold text-zinc-900 tracking-tight">15 ATS</div>
              <div className="text-xs font-medium text-zinc-500 mt-0.5">Compliant resume layouts</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-zinc-900 tracking-tight">0%</div>
              <div className="text-xs font-medium text-zinc-500 mt-0.5">AI hallucinated facts</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-zinc-900 tracking-tight">§18g</div>
              <div className="text-xs font-medium text-zinc-500 mt-0.5">Statutory Blue Card radar</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-zinc-900 tracking-tight">15 / Day</div>
              <div className="text-xs font-medium text-zinc-500 mt-0.5">Supervised anti-spam cap</div>
            </div>
          </div>

          {/* Interactive Hero UI Mockup */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 bg-zinc-50/70 px-3 sm:px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-3 rounded-full bg-red-400/80 shrink-0" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80 shrink-0" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80 shrink-0" />
                <span className="ml-2 text-[10px] sm:text-xs font-medium text-zinc-400 truncate">rightway.ai/portal/applications</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Mode A</span>
              </div>
            </div>

            <div className="flex border-b border-zinc-100 bg-white px-2 sm:px-4 text-xs font-medium overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center gap-2 border-b-2 py-3 px-2 sm:px-3 transition whitespace-nowrap shrink-0 ${
                  activeTab === 'match'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>1. Match</span>
              </button>
              <button
                onClick={() => setActiveTab('extract')}
                className={`flex items-center gap-2 border-b-2 py-3 px-2 sm:px-3 transition whitespace-nowrap shrink-0 ${
                  activeTab === 'extract'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>2. Fact Diff</span>
              </button>
              <button
                onClick={() => setActiveTab('dispatch')}
                className={`flex items-center gap-2 border-b-2 py-3 px-2 sm:px-3 transition whitespace-nowrap shrink-0 ${
                  activeTab === 'dispatch'
                    ? 'border-zinc-900 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>3. One-Click Dispatch</span>
              </button>
            </div>

            <div className="p-6 text-left">
              {activeTab === 'match' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900">Senior Distributed Systems Engineer</span>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                          96% Match
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Zalando SE • Berlin, Germany (Hybrid) • €78,000 - €92,000/yr
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200/60">
                        EU Blue Card Ready
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        English Primary
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg border border-zinc-200/70 p-3 bg-white">
                      <div className="text-zinc-500 font-medium">Skills Verified</div>
                      <div className="mt-1 font-semibold text-zinc-900">TypeScript, Go, Kafka, AWS</div>
                    </div>
                    <div className="rounded-lg border border-zinc-200/70 p-3 bg-white">
                      <div className="text-zinc-500 font-medium">Statutory Salary Gate</div>
                      <div className="mt-1 font-semibold text-emerald-700">Passed (€45,300+ Threshold)</div>
                    </div>
                    <div className="rounded-lg border border-zinc-200/70 p-3 bg-white">
                      <div className="text-zinc-500 font-medium">Degree Equivalence</div>
                      <div className="mt-1 font-semibold text-zinc-900">B.Sc Computer Science (Anabin H+)</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'extract' && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-amber-200/60 bg-amber-50/40 p-3 text-xs text-amber-900 flex items-center justify-between">
                    <span>
                      <strong>Deterministic Ground Truth:</strong> Only approved facts are compiled into the PDF.
                    </span>
                    <span className="text-[11px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-mono">
                      Strict Mode
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                      <div className="text-zinc-400 uppercase text-[10px] font-sans font-semibold mb-1">
                        Source CV Document
                      </div>
                      <p className="text-zinc-700 font-sans">
                        &quot;Engineered event-driven pipeline processing 25M daily messages using Kafka and Go.&quot;
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3">
                      <div className="text-emerald-700 uppercase text-[10px] font-sans font-semibold mb-1">
                        Confirmed Europass Fact
                      </div>
                      <p className="text-zinc-800 font-sans">
                        &quot;Led distributed event pipeline (Go, Apache Kafka) scaling to 25M records/day.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dispatch' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">Ready to Dispatch (1 of 15 today)</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Europass PDF compiled • Tailored Cover Letter attached • Sent via candidate OAuth
                    </p>
                  </div>
                  <Link
                    to="/portal/applications"
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 transition"
                  >
                    <span>Approve & Dispatch</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <CareerJourneyScrollytelling />

        {/* PRODUCT BENTO GRID */}
        <section id="product" className="mx-auto max-w-5xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>Core Architecture</span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              From raw resume to compliant European applications.
            </h2>
            <p className="mt-3 text-zinc-600 text-sm sm:text-base">
              Engineered specifically for the regulatory, linguistic, and structural standards of the European Union.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-950">Deterministic Europass Fact Vault</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Most AI job tools invent keywords to pass ATS scans. RightWay takes the opposite path: every skill,
                diploma, and employer is verified through a split-screen diff. Unconfirmed claims cannot enter the
                generated CV.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">
                  Zero Hallucination
                </span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">
                  Official Europass JSON/PDF
                </span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">
                  SHA-256 Audit Trail
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-950">EU Blue Card Radar</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Automatic filtering against national shortage occupations, German §18g salary thresholds, and Dutch
                Highly Skilled Migrant minimums.
              </p>
              <div className="mt-6 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Fail-closed visa gating</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-950">Daily 15-Cap Anti-Spam</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                European employers reject spray-and-pray bots. RightWay enforces a hard cap of 15 targeted applications
                per day to protect your reputation.
              </p>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-zinc-950">Supervised 1-Click Dispatch</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Mode A gives you the steering wheel: review the extracted role, preview the dynamically composed cover
                letter, and click &apos;Approve&apos; to dispatch directly from your authenticated mailbox.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">Google Workspace OAuth</span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">Microsoft 365 OAuth</span>
                <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-zinc-700 font-medium">Direct Inbound Tracker</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION — separate candidate vs recruiter panels */}
        <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 border-t border-zinc-200/80">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Transparent Plans</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {pricingAudience === 'candidate'
                ? 'Plans that scale with your job hunt.'
                : 'Plans that scale with your hiring team.'}
            </h2>
            <p className="mt-3 text-zinc-600 text-sm">
              {pricingAudience === 'candidate'
                ? 'Candidate pricing only — recruiters have a separate panel.'
                : 'Recruiter pricing only — candidates have a separate panel.'}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-zinc-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAudience('candidate')}
                className={`rounded-full px-4 py-1.5 transition ${
                  pricingAudience === 'candidate' ? 'bg-zinc-900 text-white' : 'text-zinc-600'
                }`}
              >
                Candidate Pricing
              </button>
              <button
                type="button"
                onClick={() => setAudience('recruiter')}
                className={`rounded-full px-4 py-1.5 transition ${
                  pricingAudience === 'recruiter' ? 'bg-blue-600 text-white' : 'text-zinc-600'
                }`}
              >
                Recruiter Pricing
              </button>
            </div>

            <div className="mt-4 inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 text-xs font-medium shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 py-1.5 transition ${
                  billingCycle === 'monthly' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`rounded-full px-4 py-1.5 transition flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span>Yearly</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-semibold text-emerald-800">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {pricingAudience === 'candidate' ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-zinc-900 hover:shadow-lg hover:outline-transparent">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Starter</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Free</h3>
                  <p className="mt-2 text-xs text-zinc-500">Explore European tech job matches</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">€0</span>
                    <span className="text-xs text-zinc-500">/ forever</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>15 live job matches / month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Europass CV builder & exporter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Deterministic fact extraction</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=candidate"
                  className="mt-8 block text-center rounded-full border border-zinc-300 bg-white py-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition"
                >
                  Get Started
                </Link>
              </div>

              <div className="relative rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-zinc-900 hover:shadow-lg hover:outline-transparent">
                <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Candidate Pro</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Active Search</h3>
                  <p className="mt-2 text-xs text-zinc-500">For engineers relocating to the EU</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">
                      €{billingCycle === 'monthly' ? '19' : '15'}
                    </span>
                    <span className="text-xs text-zinc-500">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Unlimited EU vacancy matching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>15 supervised applications / day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>EU Blue Card & visa salary radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>OAuth mailbox dispatch</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=candidate"
                  className="mt-8 block text-center rounded-full bg-zinc-900 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 transition"
                >
                  Start 7-Day Free Trial
                </Link>
              </div>

              <div className="rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-zinc-900 hover:shadow-lg hover:outline-transparent">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Relocation Elite</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Consultant Assisted</h3>
                  <p className="mt-2 text-xs text-zinc-500">Concierge support & multi-country routing</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">
                      €{billingCycle === 'monthly' ? '49' : '39'}
                    </span>
                    <span className="text-xs text-zinc-500">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Everything in Candidate Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Assigned relocation consultant</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Anabin degree pre-check</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=candidate"
                  className="mt-8 block text-center rounded-full border border-zinc-300 bg-white py-2.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition"
                >
                  Upgrade to Elite
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-blue-600 hover:shadow-lg hover:outline-transparent">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Starter Hire</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Team Free</h3>
                  <p className="mt-2 text-xs text-zinc-500">Post roles & browse verified talent</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">€0</span>
                    <span className="text-xs text-zinc-500">/ forever</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>2 active vacancies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Basic talent pool search</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Blue Card salary flags</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=recruiter"
                  className="mt-8 block text-center rounded-full border border-blue-200 bg-white py-2.5 text-xs font-medium text-blue-800 hover:bg-blue-50 transition"
                >
                  Open Recruiter Account
                </Link>
              </div>

              <div className="relative rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-blue-600 hover:shadow-lg hover:outline-transparent">
                <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Growth</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Recruiter Pro</h3>
                  <p className="mt-2 text-xs text-zinc-500">Scale EU tech hiring with verified fits</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">
                      €{billingCycle === 'monthly' ? '79' : '63'}
                    </span>
                    <span className="text-xs text-zinc-500">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Unlimited vacancies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>AI fit scoring on verified facts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Country & stack talent filters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Direct candidate outreach</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=recruiter"
                  className="mt-8 block text-center rounded-full bg-blue-600 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Start Recruiter Trial
                </Link>
              </div>

              <div className="rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm flex flex-col justify-between outline outline-1 outline-zinc-200/80 transition hover:border-blue-600 hover:shadow-lg hover:outline-transparent">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Enterprise</span>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-950">Agency / Multi-brand</h3>
                  <p className="mt-2 text-xs text-zinc-500">Shared seats & compliance reporting</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-zinc-900">
                      €{billingCycle === 'monthly' ? '199' : '159'}
                    </span>
                    <span className="text-xs text-zinc-500">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Everything in Recruiter Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Multi-seat recruiter workspace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>Sponsorship audit exports</span>
                    </li>
                  </ul>
                </div>
                <Link
                  to="/auth/register?role=recruiter"
                  className="mt-8 block text-center rounded-full border border-blue-200 bg-white py-2.5 text-xs font-medium text-blue-800 hover:bg-blue-50 transition"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16 border-t border-zinc-200/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">FAQ</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Frequently asked questions.
            </h2>
            <p className="mt-2 text-zinc-600 text-sm">
              Everything you need to know about European compliance, Europass standards, and supervised dispatch.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-zinc-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-zinc-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-zinc-50 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM DARK HIGH-CONTRAST CTA */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-center text-white sm:px-16 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-zinc-800 blur-3xl opacity-40 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="rounded-full bg-zinc-800/80 border border-zinc-700/80 px-3 py-1 text-xs font-medium text-zinc-300">
                Ready to land your EU offer?
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                Turn your job search into real European interviews.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-zinc-400">
                Stop copying and pasting cover letters into broken portals. Get verified Europass applications
                supervised and dispatched in minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 shadow transition hover:bg-zinc-100"
                >
                  <span>Start Free Search</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/portal/jobs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-7 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                >
                  <span>View Open Roles</span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> GDPR & EU anti-spam compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> EU Blue Card ready
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/80 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-7 w-7 text-sm" />
                <span className="font-semibold text-base text-zinc-900">RightWay AI</span>
              </Link>
              <p className="mt-3 text-xs text-zinc-500 max-w-sm leading-relaxed">
                Supervised European job application engine. Built with deterministic fact extraction, Europass PDF
                generation, and statutory Blue Card visa verification.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Product</div>
              <ul className="mt-3 space-y-2 text-xs text-zinc-500">
                <li>
                  <Link to="/portal/jobs" className="hover:text-zinc-900 transition">
                    Job Search
                  </Link>
                </li>
                <li>
                  <Link to="/portal/cv-builder" className="hover:text-zinc-900 transition">
                    Europass Builder
                  </Link>
                </li>
                <li>
                  <Link to="/portal/applications" className="hover:text-zinc-900 transition">
                    Supervised Dispatch
                  </Link>
                </li>
                <li>
                  <Link to="/portal/documents" className="hover:text-zinc-900 transition">
                    Fact Diff Engine
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Portal</div>
              <ul className="mt-3 space-y-2 text-xs text-zinc-500">
                <li>
                  <Link to="/auth/login?role=candidate" className="hover:text-zinc-900 transition">
                    Candidate Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register?role=candidate" className="hover:text-zinc-900 transition">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/auth/login?role=recruiter" className="hover:text-zinc-900 transition">
                    Recruiter Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/portal/dashboard" className="hover:text-zinc-900 transition">
                    Candidate Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Legal & GDPR</div>
              <ul className="mt-3 space-y-2 text-xs text-zinc-500">
                <li>
                  <Link to="/legal/gdpr-privacy" className="hover:text-zinc-900 transition">
                    GDPR Privacy Notice
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="hover:text-zinc-900 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-zinc-900 transition">
                    Security & Encryption
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 pt-6 text-xs text-zinc-400">
            <div>© {new Date().getFullYear()} RightWay AI Platform. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

