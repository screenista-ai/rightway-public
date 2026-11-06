import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CANDIDATE_STEPS = [
  {
    number: '01',
    title: 'Find the role',
    subtitle: 'Sponsored tech jobs across Europe',
    description:
      'Browse openings in Germany, Netherlands, Sweden, and France from employers who hire from abroad.',
    meta: 'Job search',
  },
  {
    number: '02',
    title: 'Prove your facts',
    subtitle: 'Upload. Confirm. Done.',
    description:
      'Add resumes and certificates. Confirm each date, degree, and skill. Nothing else reaches the CV.',
    meta: 'Your documents',
  },
  {
    number: '03',
    title: 'Clear the visa floor',
    subtitle: 'Salary + sponsorship before you draft',
    description:
      'Check Germany Blue Card thresholds and whether the employer can sponsor — before you spend a send.',
    meta: 'Visa gate',
  },
  {
    number: '04',
    title: 'Pick a format',
    subtitle: 'Europass and recruiter-ready layouts',
    description:
      'Switch templates built for European ATS tools. Tailored for tech and leadership roles.',
    meta: 'CV layouts',
  },
  {
    number: '05',
    title: 'You press send',
    subtitle: 'Your mailbox. Your name.',
    description:
      'Approve every application. Mail leaves Google or Microsoft from your account. Cap: 15/day.',
    meta: 'Dispatch',
  },
  {
    number: '06',
    title: 'Get the invite',
    subtitle: 'Interviews and relocation',
    description:
      'Replies surface as interview invites. Next stop: Berlin, Amsterdam, Stockholm, or Paris.',
    meta: 'Offers',
  },
];

const RECRUITER_STEPS = [
  {
    number: '01',
    title: 'Post the role',
    subtitle: 'Country, salary, sponsorship flags',
    description:
      'Publish openings with clear visa and salary bands so the right people apply.',
    meta: 'Vacancies',
  },
  {
    number: '02',
    title: 'Screen on proof',
    subtitle: 'Degrees and real experience',
    description:
      'Rank candidates on confirmed skills from diplomas and work history — not padded keywords.',
    meta: 'Screening',
  },
  {
    number: '03',
    title: 'Find the fit',
    subtitle: 'Country, language, stack',
    description:
      'Filter the pool by target market, language, and core tech.',
    meta: 'Search',
  },
  {
    number: '04',
    title: 'Hire direct',
    subtitle: 'No agency cut',
    description:
      'Reach candidates with clear visa status and degree fit — connect without middlemen.',
    meta: 'Hire',
  },
];

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Sticky scrub journey — one card in the viewport, scrubbed by scroll.
 * audience: 'candidate' | 'recruiter' | 'both' (both = candidate then recruiter stacks)
 */
export default function CareerJourneyScrollytelling({ audience = 'candidate' }) {
  const showCandidate = audience === 'both' || audience === 'candidate';
  const showRecruiter = audience === 'both' || audience === 'recruiter';

  return (
    <section id="how" className="relative">
      {showCandidate ? (
        <div className="rw-band-emerald">
          <StickyPathWithCta
            steps={CANDIDATE_STEPS}
            eyebrow="Candidate path"
            heading="Search to relocate"
            accent="#34d399"
            registerHref="/auth/register?role=candidate"
            loginHref="/auth/login?role=candidate"
            registerLabel="Create candidate account"
            loginLabel="Candidate sign in"
          />
        </div>
      ) : null}
      {showRecruiter ? (
        <div className="rw-band-sky">
          <StickyPathWithCta
            steps={RECRUITER_STEPS}
            eyebrow="Recruiter path"
            heading="Post to hire"
            accent="#38bdf8"
            registerHref="/auth/register?role=recruiter"
            loginHref="/auth/login?role=recruiter"
            registerLabel="Create recruiter account"
            loginLabel="Recruiter sign in"
          />
        </div>
      ) : null}
    </section>
  );
}

function StickyPath({ steps, eyebrow, heading, accent = '#34d399' }) {
  const pinRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [stackLayout, setStackLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqNarrow = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      setReduced(mq.matches);
      setStackLayout(mq.matches || mqNarrow.matches);
    };
    sync();
    mq.addEventListener?.('change', sync);
    mqNarrow.addEventListener?.('change', sync);
    return () => {
      mq.removeEventListener?.('change', sync);
      mqNarrow.removeEventListener?.('change', sync);
    };
  }, []);

  useEffect(() => {
    if (stackLayout) return undefined;
    function onScroll() {
      const el = pinRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const scrolled = clamp(-rect.top, 0, total);
      const p = scrolled / total;
      setLocalProgress(p);
      const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
      setIndex(i);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [steps.length, stackLayout]);

  const step = steps[index] || steps[0];
  const segment = steps.length > 0 ? (localProgress * steps.length) % 1 : 0;
  const enter = reduced ? 1 : clamp(segment / 0.35, 0, 1);
  const cardY = reduced ? 0 : (1 - enter) * 72;
  const cardOpacity = reduced ? 1 : 0.25 + enter * 0.75;
  const cardScale = reduced ? 1 : 0.94 + enter * 0.06;

  if (stackLayout) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 space-y-10 sm:space-y-16">
        <header className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-6xl font-extrabold tracking-tight text-white">
            {heading}
          </h2>
        </header>
        {steps.map((s, i) => (
          <article
            key={s.number}
            className="border border-white/15 bg-[#f7f4ef] p-6 sm:p-8 text-[#0a0a0a] rw-path-card-in"
            style={{
              borderTop: `4px solid ${accent}`,
              animationDelay: `${Math.min(i, 5) * 60}ms`,
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5c5a55]">
              {s.meta}
            </p>
            <p className="mt-2 font-display text-4xl text-black/15 tabular-nums leading-none">{s.number}</p>
            <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold text-[#0a0a0a]">{s.title}</h3>
            <p className="mt-2 text-sm font-semibold" style={{ color: accent === '#38bdf8' ? '#0284c7' : '#047857' }}>
              {s.subtitle}
            </p>
            <p className="mt-4 text-sm text-[#5c5a55] leading-relaxed">{s.description}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={pinRef}
      className="relative rw-path-pin"
      style={{ height: `${Math.max(steps.length, 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 origin-top"
            style={{ transform: `scaleY(${localProgress})`, background: accent }}
          />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-4 py-10 sm:px-8 sm:py-14 lg:flex-row lg:items-center lg:gap-16 lg:py-0">
          <div className="lg:w-[42%] shrink-0 space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[0.95]">
              {heading}
            </h2>
            <p
              className="font-display text-[clamp(4rem,12vw,8rem)] font-extrabold leading-none tracking-[-0.06em] tabular-nums select-none"
              style={{ color: accent, opacity: 0.35 }}
            >
              {step.number}
            </p>
            <div className="flex gap-1.5 pt-2">
              {steps.map((s, i) => (
                <span
                  key={s.number}
                  className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= index ? accent : 'rgba(255,255,255,0.18)' }}
                />
              ))}
            </div>
          </div>

          <div className="lg:flex-1 mt-8 lg:mt-0 flex items-center">
            <article
              className="w-full border border-white/20 bg-[#f7f4ef] p-7 sm:p-10 text-[#0a0a0a] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                willChange: 'transform, opacity',
                borderTop: `4px solid ${accent}`,
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5c5a55]">
                {step.meta}
              </p>
              <h3 className="mt-4 font-display text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-[#0a0a0a]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm font-semibold" style={{ color: accent === '#38bdf8' ? '#0284c7' : '#047857' }}>
                {step.subtitle}
              </p>
              <p className="mt-5 text-sm sm:text-base text-[#5c5a55] leading-relaxed max-w-lg">
                {step.description}
              </p>
            </article>
          </div>
        </div>
      </div>

    </div>
  );
}

function StickyPathWithCta(props) {
  return (
    <>
      <StickyPath {...props} />
      <div className="mx-auto max-w-6xl px-4 sm:px-8 pb-20 pt-4">
        <PathCta
          registerHref={props.registerHref}
          loginHref={props.loginHref}
          registerLabel={props.registerLabel}
          loginLabel={props.loginLabel}
        />
      </div>
    </>
  );
}

function PathCta({ registerHref, loginHref, registerLabel, loginLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t border-white/15 pt-12">
      <div className="max-w-md space-y-2">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ready when you are.
        </h3>
        <p className="text-sm text-white/60">
          Free account. You approve every send.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to={registerHref}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#0a0a0a] hover:bg-[#f7f4ef] transition rw-cta-nudge"
        >
          <span>{registerLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to={loginHref}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition"
        >
          {loginLabel}
        </Link>
      </div>
    </div>
  );
}
