import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const initialAudience = searchParams.get('audience') === 'recruiter' ? 'recruiter' : 'candidate';

  const [audience, setAudience] = useState(initialAudience); // 'candidate' | 'recruiter'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [hoveredTier, setHoveredTier] = useState(1);

  // Exact plans from http://localhost:3003/#pricing (Candidate Portal)
  const candidatePlans = [
    {
      id: 'candidate-free',
      category: 'Starter',
      name: 'Free',
      tagline: 'Explore European tech job matches',
      priceMonthly: 0,
      priceYearly: 0,
      period: '/ forever',
      features: [
        '15 live job matches / month',
        'Europass CV builder & exporter',
        'Deterministic fact extraction',
        'Fact Vault credential storage',
        'EU Blue Card salary floor check',
      ],
      ctaText: 'Get Started Free',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
    {
      id: 'candidate-pro',
      category: 'Candidate Pro',
      name: 'Active Search',
      tagline: 'For engineers relocating to the EU',
      priceMonthly: 19,
      priceYearly: 15,
      period: '/ month',
      features: [
        'Unlimited EU vacancy matching',
        '15 supervised applications / day',
        'EU Blue Card & visa salary radar',
        'Personal Mailbox OAuth dispatch',
        'Priority ATS formatting templates',
        'Visa sponsorship probability score',
      ],
      ctaText: 'Start 7-Day Free Trial',
      ctaHref: surfaces.candidateRegister(),
      popular: true,
    },
    {
      id: 'candidate-elite',
      category: 'Relocation Elite',
      name: 'Consultant Assisted',
      tagline: 'Concierge support & multi-country routing',
      priceMonthly: 49,
      priceYearly: 39,
      period: '/ month',
      features: [
        'Everything in Candidate Pro',
        'Assigned relocation consultant',
        'Anabin degree pre-check verification',
        'Priority embassy appointment prep',
        'Direct recruiter inbox introductions',
        'Immigration & visa legal guidance',
      ],
      ctaText: 'Join Relocation Elite',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
  ];

  // Exact plans from http://127.0.0.1:3005/#pricing (Recruiter Portal)
  const recruiterPlans = [
    {
      id: 'recruiter-free',
      category: 'Starter Hire',
      name: 'Team Free',
      tagline: 'Post roles & browse verified talent',
      priceMonthly: 0,
      priceYearly: 0,
      period: '/ forever',
      features: [
        '2 active vacancies',
        'Basic talent pool search',
        'Blue Card salary threshold flags',
        'Verified credential badge preview',
        'Standard candidate applications',
      ],
      ctaText: 'Open Free Team Account',
      ctaHref: surfaces.recruiterLogin(),
      popular: false,
    },
    {
      id: 'recruiter-pro',
      category: 'Growth',
      name: 'Recruiter Pro',
      tagline: 'Scale EU tech hiring with verified fits',
      priceMonthly: 79,
      priceYearly: 63,
      period: '/ month',
      features: [
        'Unlimited active vacancies',
        'AI fit scoring on verified facts',
        'Country & tech stack talent filters',
        'Direct candidate outreach messaging',
        'Automated visa sponsorship checks',
        'Applicant export to Greenhouse & Lever',
      ],
      ctaText: 'Start Recruiter Trial',
      ctaHref: surfaces.recruiterLogin(),
      popular: true,
    },
    {
      id: 'recruiter-enterprise',
      category: 'Enterprise',
      name: 'Agency / Multi-brand',
      tagline: 'Shared seats & compliance reporting',
      priceMonthly: 199,
      priceYearly: 159,
      period: '/ month',
      features: [
        'Everything in Recruiter Pro',
        'Multi-seat recruiter workspace (up to 10)',
        'Sponsorship audit compliance exports',
        'Dedicated account manager & SLA',
        'Custom ATS & HRIS API integration',
        'Priority pre-verified talent sourcing',
      ],
      ctaText: 'Contact Enterprise Sales',
      ctaHref: surfaces.recruiterLogin(),
      popular: false,
    },
  ];

  const currentPlans = audience === 'candidate' ? candidatePlans : recruiterPlans;

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>Transparent &amp; Aligned Plans</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              Simple, Predictable Plans.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Pricing matches candidate and recruiter portals. No hidden commissions, no surprise invoices.
            </p>

            {/* Audience Segment Toggle (Candidate vs Recruiter) */}
            <div className="pt-3 flex justify-center">
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 text-xs font-semibold shadow-sm">
                <button
                  type="button"
                  onClick={() => setAudience('candidate')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 transition cursor-pointer ${
                    audience === 'candidate'
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Job Seekers (Candidate)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudience('recruiter')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 transition cursor-pointer ${
                    audience === 'recruiter'
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Employers &amp; HR (Recruiter)</span>
                </button>
              </div>
            </div>

            {/* Billing Cycle Toggle (Monthly / Yearly) */}
            <div className="pt-1 flex items-center justify-center gap-3 text-xs">
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 font-medium shadow-2xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-full px-3.5 py-1 transition cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-zinc-100 font-semibold text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`rounded-full px-3.5 py-1 transition flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-zinc-100 font-semibold text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2"
            onMouseLeave={() => setHoveredTier(1)}
          >
            {currentPlans.map((plan, idx) => {
              const isHovered = hoveredTier === idx;
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setHoveredTier(idx)}
                  className={`relative rounded-3xl border-2 bg-white p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                    isHovered
                      ? 'border-zinc-950 shadow-xl scale-[1.02]'
                      : 'border-zinc-200/90 shadow-sm'
                  }`}
                >
                  {plan.popular && (
                    <span className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-orange-400" />
                      <span>Most Popular</span>
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        {plan.category}
                      </span>
                      <h3 className="mt-1 text-2xl font-bold text-zinc-950">{plan.name}</h3>
                      <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
                        €{price}
                      </span>
                      <span className="text-xs font-medium text-zinc-500">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 text-xs text-zinc-700 pt-2 border-t border-zinc-100">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <a
                      href={plan.ctaHref}
                      className={`block w-full text-center rounded-full py-3 text-xs font-semibold transition cursor-pointer shadow-xs ${
                        isHovered
                          ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                          : 'border border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
                      }`}
                    >
                      {plan.ctaText}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transparency Promise Bar */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-950">100% Platform Price Parity</h4>
                <p className="text-xs text-zinc-500">
                  Plans activated here sync directly to candidate ({surfaces.candidateLogin()}) and recruiter ({surfaces.recruiterLogin()}) accounts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
              <span className="inline-flex items-center gap-1">
                <Check className="h-4 w-4 text-emerald-600" /> Cancel anytime
              </span>
              <span className="text-zinc-300">&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Check className="h-4 w-4 text-emerald-600" /> EU VAT compliant
              </span>
            </div>
          </div>

          {/* Common Questions */}
          <div className="space-y-4 pt-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-zinc-950 text-center">Frequently Asked Questions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-orange-600" />
                  <span>Can I switch between monthly and yearly?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Yes, upgrade or switch billing cycles anytime from your account settings. Unused time is prorated automatically.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-orange-600" />
                  <span>Do you take commission on hired salaries?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Never. RightWay is subscription-based. We take 0% commission from candidates and 0% placement fees from recruiters.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-orange-600" />
                  <span>How does the 7-day free trial work?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Active Search includes full vacancy matching, Blue Card radar, and mailbox dispatch for 7 days with no charge until day 8.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-orange-600" />
                  <span>Can our team add more recruiter seats?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Yes, Agency / Multi-brand accounts support shared workspace seats, team member permissions, and centralized billing.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
