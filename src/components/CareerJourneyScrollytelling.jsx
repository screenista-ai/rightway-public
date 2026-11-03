import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  FileText,
  Send,
  Award,
  ArrowRight,
  Briefcase,
  Plane,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CANDIDATE_STEPS = [
  {
    number: '01',
    title: 'The European Dream',
    subtitle: 'From global ambition to verified EU tech role',
    description:
      'Every great career journey starts with an ambition. Discover high-opportunity tech and engineering roles across Germany, Netherlands, Sweden, and France that actively sponsor international talent.',
    badge: 'Ambition & Discovery',
    icon: Sparkles,
    meta: 'European Tech & Engineering Vacancies',
  },
  {
    number: '02',
    title: 'The Verified Fact Vault',
    subtitle: '100% Ground Truth • Zero AI Hallucination',
    description:
      'Upload your resumes and degree certificates. Our deterministic extractor pulls every date, degree, and competency. You confirm each fact side-by-side. The model is barred from inventing unverified experience.',
    badge: 'Deterministic Fact Engine',
    icon: ShieldCheck,
    meta: 'German Anabin H+ & CEFR Verified',
  },
  {
    number: '03',
    title: 'EU Blue Card Radar',
    subtitle: 'Statutory salary floors & verified sponsorship',
    description:
      'Our engine automatically cross-checks statutory minimum salaries (e.g. German §18g AufenthG Blue Card threshold at €45,300+) and employer visa sponsorship histories. Never waste an application on a company that rejects non-EU talent.',
    badge: 'Visa Compatibility Gate',
    icon: Building2,
    meta: 'Statutory Salary & Sponsorship Gate',
  },
  {
    number: '04',
    title: '15 ATS Templates & Europass',
    subtitle: 'Tailored variations for European recruiters',
    description:
      'Switch between EU Official Europass, Custom Resume 1 (Tech Specialist), and Custom Resume 2 (Leadership & Scaling). Rendered dynamically into 15 ATS-optimized layouts tailored for Workday, Greenhouse, and Lever.',
    badge: '15 ATS Templates Catalog',
    icon: FileText,
    meta: '100% Parsable by Workday, Greenhouse & Lever',
  },
  {
    number: '05',
    title: 'Supervised 1-Click Dispatch',
    subtitle: 'Your email • Your domain • Your reputation',
    description:
      'Nothing is dispatched without your approval. In 1-click, dispatch tailored applications with attached PDFs directly from your authenticated Google Workspace or Microsoft 365 mailbox, capped at 15/day for anti-spam safety.',
    badge: 'Personal Mailbox OAuth',
    icon: Send,
    meta: 'Supervised Dispatch • Max 15/Day Cap',
  },
  {
    number: '06',
    title: 'Landing in Europe',
    subtitle: 'Direct interviews & relocation offer',
    description:
      'Our background sync worker listens to your connected mailbox threads 24/7, classifying replies and flagging interview invitations within minutes. Relocate to Berlin, Amsterdam, Stockholm, or Paris with confidence.',
    badge: 'Interview & Relocation',
    icon: Award,
    meta: 'Verified Interview & Relocation Path',
  },
];

const RECRUITER_STEPS = [
  {
    number: '01',
    title: 'Publish European Vacancies',
    subtitle: 'Direct EU tech & blue card postings',
    description:
      'Publish positions with explicit country selection, statutory salary bands, remote eligibility, and EU Blue Card / visa sponsorship flags.',
    badge: 'Direct Vacancy Post',
    icon: Briefcase,
    meta: 'Target DE, NL, SE, FR, ES, CH',
  },
  {
    number: '02',
    title: 'Verified Fact Screening',
    subtitle: 'No keyword stuffing • Genuine verified skills',
    description:
      'Say goodbye to inflated or AI-hallucinated resumes. Candidates are scored on verified competencies extracted directly from original diplomas and audited experience.',
    badge: 'AI Fit Scoring',
    icon: ShieldCheck,
    meta: 'Cosine Semantic Compatibility',
  },
  {
    number: '03',
    title: 'Talent Discovery & Filtering',
    subtitle: 'Instant candidate filter by country & stack',
    description:
      'Filter pre-verified international candidates by target country, primary language proficiency, and core tech stacks (React, Node, Go, Python, Cloud).',
    badge: 'Talent Pool Search',
    icon: Sparkles,
    meta: 'Pre-Vetted International Pool',
  },
  {
    number: '04',
    title: 'Direct Hire & Relocation',
    subtitle: 'Connect without recruitment agency markups',
    description:
      'Reach out directly to matched candidates with full transparency into their legal visa eligibility and degree equivalence.',
    badge: 'Hired & Relocated',
    icon: Award,
    meta: 'Direct Connection • Zero Agency Markups',
  },
];

function JourneyTrack({ id, steps, accent = 'zinc', registerHref, loginHref, cta }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stepsWrapRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    function handleScroll() {
      const wrap = stepsWrapRef.current;
      if (!wrap) return;
      const windowHeight = window.innerHeight;
      const mid = windowHeight / 2;
      const wrapRect = wrap.getBoundingClientRect();
      const total = Math.max(wrapRect.height, 1);
      // Progress only across the steps rail — not the CTA below
      const raw = (mid - wrapRect.top) / total;
      const progress = Math.max(0, Math.min(1, raw));
      setScrollProgress(progress);

      // Tip of filled rail must meet node center before glow
      let best = -1;
      const railInset = 28; // top-7 / bottom-7 ≈ 1.75rem
      const tipYInWrap = railInset + progress * Math.max(wrapRect.height - railInset * 2, 1);
      nodeRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const nodeYInWrap = r.top + r.height / 2 - wrapRect.top;
        if (tipYInWrap >= nodeYInWrap - 2) best = idx;
      });
      setActiveStep(best);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length, id]);

  const lineActive = accent === 'blue' ? 'bg-blue-600' : 'bg-zinc-900';

  return (
    <div className="relative mt-10 pb-8">
      <div className="mb-8 flex justify-center sticky top-20 z-20">
        <div className="rounded-full bg-white/95 border border-zinc-200/90 px-4 py-1.5 shadow-sm backdrop-blur flex items-center gap-2 text-xs font-semibold text-zinc-700 max-w-[calc(100vw-2rem)]">
          <Plane className={`h-3.5 w-3.5 shrink-0 ${accent === 'blue' ? 'text-blue-600' : 'text-zinc-900'}`} />
          <span className="font-mono text-zinc-900">{Math.round(scrollProgress * 100)}%</span>
          <span className="text-zinc-300">•</span>
          <span className={`truncate ${accent === 'blue' ? 'text-blue-700' : 'text-zinc-800'}`}>
            {(() => {
              const labelStep = activeStep < 0 ? 0 : activeStep;
              return `Stage ${steps[labelStep]?.number}: ${steps[labelStep]?.title}`;
            })()}
          </span>
        </div>
      </div>

      {/* Rail + steps only — path stops at last node, never into CTA */}
      <div ref={stepsWrapRef} className="relative z-10">
        <div className="pointer-events-none absolute left-6 md:left-1/2 top-7 bottom-7 w-0 -translate-x-1/2 z-0 block">
          <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-zinc-200/80" />
          <div
            className={`absolute top-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full ${lineActive}`}
            style={{
              height: `${scrollProgress * 100}%`,
              transition: 'height 0.1s linear',
            }}
          />
        </div>

        <div className="relative z-10 space-y-12 md:space-y-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLeft = idx % 2 === 0;
            const isReached = activeStep >= 0 && idx <= activeStep;
            const isTip = activeStep >= 0 && idx === activeStep;

            let nodeClass = 'bg-white border-2 border-zinc-300 text-zinc-500';
            if (isReached && !isTip) {
              nodeClass =
                accent === 'blue'
                  ? 'bg-blue-600 text-white border-2 border-blue-600'
                  : 'bg-zinc-900 text-white border-2 border-zinc-900';
            } else if (isTip) {
              nodeClass =
                accent === 'blue'
                  ? 'bg-blue-600 text-white border-2 border-blue-600 ring-4 ring-blue-500/30 scale-105'
                  : 'bg-zinc-900 text-white border-2 border-zinc-900 ring-4 ring-zinc-900/25 scale-105';
            }

            return (
              <div key={`${id}-${step.number}`} className="relative md:static">
                {/* Mobile-only left-rail layout (< md) */}
                <div className="md:hidden relative flex items-start pl-14 sm:pl-16 min-w-0">
                  <div
                    ref={(el) => {
                      if (el && typeof window !== 'undefined' && window.innerWidth < 768) {
                        nodeRefs.current[idx] = el;
                      }
                    }}
                    className={`absolute left-6 -translate-x-1/2 top-4 h-11 w-11 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10 ${nodeClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="w-full min-w-0">
                    <StepCard step={step} isActive={isTip} accent={accent} />
                  </div>
                </div>

                {/* Desktop alternating layout (>= md) */}
                <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-center gap-0">
                  <div className="min-w-0 md:pr-6">
                    {isLeft ? (
                      <StepCard step={step} isActive={isTip} accent={accent} />
                    ) : (
                      <p className="text-xs text-zinc-400 italic text-right">
                        Stage {step.number} · {step.badge}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div
                      ref={(el) => {
                        if (el && (typeof window === 'undefined' || window.innerWidth >= 768)) {
                          nodeRefs.current[idx] = el;
                        }
                      }}
                      className={`h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${nodeClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="min-w-0 md:pl-6">
                    {isLeft ? (
                      <p className="text-xs text-zinc-400 italic text-left">
                        Stage {step.number} · {step.badge}
                      </p>
                    ) : (
                      <StepCard step={step} isActive={isTip} accent={accent} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center rounded-3xl border border-zinc-200 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 sm:p-10 text-white shadow-2xl max-w-2xl mx-auto relative z-10">
        <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 mb-3">
          {cta.badge}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{cta.title}</h3>
        <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed">{cta.body}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={registerHref}
            className="rounded-full bg-white px-7 py-3 text-xs font-bold text-zinc-950 shadow hover:bg-zinc-100 transition inline-flex items-center gap-1.5"
          >
            <span>{cta.registerLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to={loginHref}
            className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition"
          >
            {cta.loginLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, isActive, accent }) {
  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 transition-all duration-300 ${
        isActive
          ? accent === 'blue'
            ? 'border-blue-600 bg-white shadow-xl ring-2 ring-blue-600/10'
            : 'border-zinc-900 bg-white shadow-xl ring-2 ring-zinc-900/10'
          : 'border-zinc-200 bg-white/90 hover:border-zinc-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-700">
          {step.badge}
        </span>
        <span className="text-xs font-mono font-bold text-zinc-400 shrink-0">STAGE {step.number}</span>
      </div>
      <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{step.title}</h3>
      <p className={`text-xs font-semibold mt-1 ${accent === 'blue' ? 'text-blue-600' : 'text-zinc-700'}`}>
        {step.subtitle}
      </p>
      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{step.description}</p>
      <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs font-medium text-zinc-500">
        <span className="min-w-0">{step.meta}</span>
        {isActive ? <span className="text-zinc-900 font-bold shrink-0">Current</span> : null}
      </div>
    </div>
  );
}

/** audience: 'candidate' | 'recruiter' | 'both' */
export default function CareerJourneyScrollytelling({ audience = 'both' }) {
  const showCandidate = audience === 'both' || audience === 'candidate';
  const showRecruiter = audience === 'both' || audience === 'recruiter';

  return (
    <section id="how" className="relative mx-auto max-w-5xl px-4 py-20 overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Interactive Career Journey</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950">
          {audience === 'recruiter' ? 'How European Hiring Gets Done.' : 'How European Careers Get Built.'}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-zinc-600">
          {audience === 'candidate'
            ? 'Follow the job-seeker path from verified facts to EU interviews.'
            : audience === 'recruiter'
              ? 'Follow the employer path from posting to verified international hire.'
              : 'Follow the candidate journey, then the recruiter journey — each path has its own stages.'}
        </p>
      </div>

      {showCandidate ? (
        <div className="mt-14">
          <div className="text-center mb-2">
            <span className="inline-flex rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white">
              Candidate Path
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">Dream → Relocated</h3>
            <p className="mt-2 text-sm text-zinc-600 max-w-xl mx-auto">
              For job seekers: verify facts, pass Blue Card gates, dispatch supervised applications.
            </p>
          </div>
          <JourneyTrack
            id="candidate"
            steps={CANDIDATE_STEPS}
            accent="zinc"
            registerHref="/auth/register?role=candidate"
            loginHref="/auth/login?role=candidate"
            cta={{
              badge: 'Destination: Verified European Job Offer',
              title: 'Your European Relocation Starts Today.',
              body: 'Upload credentials to the Fact Vault, pick ATS templates, and navigate Blue Card compliance.',
              registerLabel: 'Create Candidate Account',
              loginLabel: 'Candidate Sign In',
            }}
          />
        </div>
      ) : null}

      {showRecruiter ? (
        <div className={showCandidate ? 'mt-24 border-t border-zinc-200 pt-16' : 'mt-14'}>
          <div className="text-center mb-2">
            <span className="inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white">
              Recruiter Path
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">Post → Hired</h3>
            <p className="mt-2 text-sm text-zinc-600 max-w-xl mx-auto">
              For employers: publish vacancies, screen verified talent, hire without agency markups.
            </p>
          </div>
          <JourneyTrack
            id="recruiter"
            steps={RECRUITER_STEPS}
            accent="blue"
            registerHref="/auth/register?role=recruiter"
            loginHref="/auth/login?role=recruiter"
            cta={{
              badge: 'Destination: Verified International Hire',
              title: 'Hire verified EU-ready talent today.',
              body: 'Post sponsorship-ready roles and filter pre-verified candidates by country and stack.',
              registerLabel: 'Create Recruiter Account',
              loginLabel: 'Recruiter Sign In',
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
