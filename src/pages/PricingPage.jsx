import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
import { fetchPublicPlans, planToTier } from '../lib/plans';
import {
  Check,
  Sparkles,
  ShieldCheck,
  User,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

const FALLBACK = {
  CANDIDATE: [
    {
      code: 'FREE',
      category: 'Starter',
      name: 'Free',
      tagline: 'Explore European tech job matches',
      priceMonthly: 0,
      priceYearly: 0,
      featureLabels: [
        '15 live job matches / month',
        'Europass CV builder & exporter',
        'Confirmed fact extraction',
      ],
    },
    {
      code: 'PRO',
      category: 'Candidate Pro',
      name: 'Active Search',
      tagline: 'For engineers relocating to the EU',
      priceMonthly: 19,
      priceYearly: 15,
      featureLabels: [
        'Unlimited EU vacancy matching',
        '15 supervised applications / day',
        'EU Blue Card & visa salary radar',
        'OAuth mailbox dispatch',
      ],
    },
    {
      code: 'ELITE',
      category: 'Relocation Elite',
      name: 'Consultant Assisted',
      tagline: 'Concierge support & multi-country routing',
      priceMonthly: 49,
      priceYearly: 39,
      featureLabels: [
        'Everything in Candidate Pro',
        'Assigned relocation consultant',
        'Anabin degree pre-check',
      ],
    },
  ],
  RECRUITER: [
    {
      code: 'FREE',
      category: 'Starter Hire',
      name: 'Team Free',
      tagline: 'Post roles & browse confirmed talent',
      priceMonthly: 0,
      priceYearly: 0,
      featureLabels: [
        '2 active vacancies',
        'Basic talent pool search',
        'Blue Card salary flags',
      ],
    },
    {
      code: 'PRO',
      category: 'Growth',
      name: 'Recruiter Pro',
      tagline: 'Scale EU tech hiring with confirmed fits',
      priceMonthly: 79,
      priceYearly: 63,
      featureLabels: [
        'Unlimited vacancies',
        'Fit scoring on confirmed facts',
        'Country & stack talent filters',
        'Direct candidate outreach',
      ],
    },
    {
      code: 'ELITE',
      category: 'Enterprise',
      name: 'Agency / Multi-brand',
      tagline: 'Shared seats & compliance reporting',
      priceMonthly: 199,
      priceYearly: 159,
      featureLabels: [
        'Everything in Recruiter Pro',
        'Multi-seat recruiter workspace',
        'Sponsorship audit exports',
      ],
    },
  ],
};

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const initialAudience = searchParams.get('audience') === 'recruiter' ? 'recruiter' : 'candidate';

  const [audience, setAudience] = useState(initialAudience);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredPricingTier, setHoveredPricingTier] = useState(1);
  const [hoveredCycle, setHoveredCycle] = useState(null);
  const [hoveredAudience, setHoveredAudience] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryRole, setEnquiryRole] = useState('RECRUITER');
  const [catalog, setCatalog] = useState({ CANDIDATE: null, RECRUITER: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchPublicPlans('CANDIDATE').catch(() => null),
      fetchPublicPlans('RECRUITER').catch(() => null),
    ]).then(([cand, rec]) => {
      if (cancelled) return;
      setCatalog({
        CANDIDATE: cand?.length ? cand : null,
        RECRUITER: rec?.length ? rec : null,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const audienceKey = audience === 'recruiter' ? 'RECRUITER' : 'CANDIDATE';
  const currentTiers = useMemo(() => {
    const source = catalog[audienceKey]?.length ? catalog[audienceKey] : FALLBACK[audienceKey];
    return source.map((p) => planToTier(p, { billingCycle, audience: audienceKey }));
  }, [catalog, audienceKey, billingCycle]);

  const isRecruiter = audience === 'recruiter';
  const accent = isRecruiter ? 'var(--rw-accent-2)' : 'var(--rw-accent)';

  const toggleShell =
    'inline-flex items-center rounded-full border border-[var(--rw-line)] rw-surface p-1 text-xs font-semibold';
  const toggleOn = 'bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-xs';
  const toggleOff = 'text-[var(--rw-muted)] hover:text-[var(--rw-ink)]';

  function ctaClass(isHovered) {
    if (isHovered) {
      return isRecruiter
        ? 'bg-[var(--rw-accent-2)] text-white shadow-sm hover:opacity-90'
        : 'bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-sm hover:opacity-90';
    }
    return isRecruiter
      ? 'border border-[var(--rw-accent-2)]/40 rw-surface text-[var(--rw-accent-2)] hover:bg-[var(--rw-sky-soft)]'
      : 'border border-[var(--rw-line)] rw-surface text-[var(--rw-ink)] hover:border-[var(--rw-ink)]';
  }

  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent)] selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="rw-page-hero">
          <div className="mx-auto max-w-xl px-4 text-center space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--rw-accent)]">
              Transparent plans
            </span>
            <h1 className="text-3xl font-display font-semibold tracking-tight text-[var(--rw-ink)] sm:text-5xl">
              {isRecruiter
                ? 'Plans that scale with your hiring team.'
                : 'Plans that scale with your job hunt.'}
            </h1>
            <p className="text-sm text-[var(--rw-muted)] leading-relaxed">
              {isRecruiter
                ? 'Recruiter pricing matches employer portal. After login, manage your plan under Billing.'
                : 'Candidate pricing matches job seeker portal. After login, manage your plan under Billing.'}
            </p>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="pt-3 flex justify-center">
              <div className={toggleShell} onMouseLeave={() => setHoveredAudience(null)}>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredAudience('candidate')}
                  onClick={() => {
                    setAudience('candidate');
                    setHoveredPricingTier(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-2 transition cursor-pointer ${
                    (hoveredAudience !== null ? hoveredAudience === 'candidate' : audience === 'candidate')
                      ? toggleOn
                      : toggleOff
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Job Seekers</span>
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setHoveredAudience('recruiter')}
                  onClick={() => {
                    setAudience('recruiter');
                    setHoveredPricingTier(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-2 transition cursor-pointer ${
                    (hoveredAudience !== null ? hoveredAudience === 'recruiter' : audience === 'recruiter')
                      ? toggleOn
                      : toggleOff
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Employers</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <div className={toggleShell} onMouseLeave={() => setHoveredCycle(null)}>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredCycle('monthly')}
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                    (hoveredCycle !== null ? hoveredCycle === 'monthly' : billingCycle === 'monthly')
                      ? toggleOn
                      : toggleOff
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onMouseEnter={() => setHoveredCycle('yearly')}
                  onClick={() => setBillingCycle('yearly')}
                  className={`rounded-full px-4 py-1.5 transition flex items-center gap-1.5 cursor-pointer ${
                    (hoveredCycle !== null ? hoveredCycle === 'yearly' : billingCycle === 'yearly')
                      ? toggleOn
                      : toggleOff
                  }`}
                >
                  <span>Yearly</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      (hoveredCycle !== null ? hoveredCycle === 'yearly' : billingCycle === 'yearly')
                        ? 'bg-[var(--rw-accent)] text-[var(--rw-paper)]'
                        : 'bg-[var(--rw-accent-soft)] text-[var(--rw-accent)]'
                    }`}
                  >
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-stretch pt-4"
            onMouseLeave={() => setHoveredPricingTier(1)}
          >
            {currentTiers.map((tier, idx) => {
              const isHovered = hoveredPricingTier === idx;

              return (
                <div
                  key={tier.id}
                  onMouseEnter={() => setHoveredPricingTier(idx)}
                  className={`relative rounded-2xl border-2 rw-surface rw-card-lift p-7 pt-9 flex flex-col justify-between transition duration-200 ${
                    isHovered
                      ? 'shadow-lg outline-transparent'
                      : 'border-transparent outline outline-1 outline-[var(--rw-line)]'
                  }`}
                  style={isHovered ? { borderColor: accent } : undefined}
                >
                  {tier.popular ? (
                    <span
                      className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 text-white"
                      style={{ background: accent }}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Most Popular</span>
                    </span>
                  ) : null}

                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: isRecruiter ? 'var(--rw-accent-2)' : 'var(--rw-muted)' }}
                    >
                      {tier.category}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-[var(--rw-ink)]">{tier.name}</h3>
                    <p className="mt-2 text-xs text-[var(--rw-muted)]">{tier.tagline}</p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-[var(--rw-ink)]">{tier.price}</span>
                      <span className="text-xs text-[var(--rw-muted)]">{tier.period}</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-[var(--rw-muted)]">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check
                            className="h-4 w-4 shrink-0"
                            style={{ color: accent }}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.isEnquiry ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEnquiryRole('RECRUITER');
                        setEnquiryOpen(true);
                      }}
                      onMouseEnter={() => setHoveredPricingTier(idx)}
                      className={`mt-8 w-full block text-center rounded-full py-2.5 text-xs font-semibold transition duration-200 cursor-pointer ${ctaClass(isHovered)}`}
                    >
                      {tier.ctaText}
                    </button>
                  ) : (
                    <a
                      href={tier.ctaHref}
                      onMouseEnter={() => setHoveredPricingTier(idx)}
                      className={`mt-8 block text-center rounded-full py-2.5 text-xs font-medium transition duration-200 cursor-pointer ${ctaClass(isHovered)}`}
                    >
                      {tier.ctaText}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--rw-accent-soft)] text-[var(--rw-accent)] border border-[var(--rw-accent)]/25">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--rw-ink)]">Same price in-app</h4>
                <p className="text-xs text-[var(--rw-muted)]">
                  {isRecruiter
                    ? 'Matches employer portal billing.'
                    : 'Matches candidate portal billing.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--rw-muted)]">
              <span className="inline-flex items-center gap-1">
                <Check className="h-4 w-4 text-[var(--rw-accent)]" /> Cancel anytime
              </span>
              <span className="text-[var(--rw-line)]">&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Check className="h-4 w-4 text-[var(--rw-accent)]" /> EU VAT compliant
              </span>
            </div>
          </div>

          <div className="border-t border-[var(--rw-line)] pt-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-muted)]">FAQ</span>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--rw-ink)] sm:text-4xl">
                Common questions
              </h2>
              <p className="mt-2 text-[var(--rw-muted)] text-sm">
                {isRecruiter
                  ? 'Talent search, Blue Card filters, and direct hire.'
                  : 'Job matching, Blue Card checks, and applications.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-5 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--rw-ink)]">
                  <HelpCircle className="h-4 w-4 text-[var(--rw-accent)]" />
                  <span>Can I switch monthly and yearly?</span>
                </div>
                <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
                  Yes. Change billing in account settings. Unused time is prorated.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-5 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-[var(--rw-ink)]">
                  <HelpCircle className="h-4 w-4 text-[var(--rw-accent)]" />
                  <span>Do you take placement commissions?</span>
                </div>
                <p className="text-xs text-[var(--rw-muted)] leading-relaxed">
                  No. Flat subscription only — 0% commission from candidates or employers.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialRole={enquiryRole}
      />
    </div>
  );
}
