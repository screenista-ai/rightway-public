import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
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
  const [hoveredPricingTier, setHoveredPricingTier] = useState(1);
  const [hoveredCycle, setHoveredCycle] = useState(null);
  const [hoveredAudience, setHoveredAudience] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryRole, setEnquiryRole] = useState('RECRUITER');

  // Exact data from http://localhost:3003/#pricing (Candidate Portal)
  const candidateTiers = [
    {
      id: 'candidate-0',
      category: 'Starter',
      name: 'Free',
      tagline: 'Explore European tech job matches',
      price: '€0',
      period: '/ forever',
      features: [
        '15 live job matches / month',
        'Europass CV builder & exporter',
        'Deterministic fact extraction',
      ],
      ctaText: 'Get Started',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
    {
      id: 'candidate-1',
      category: 'Candidate Pro',
      name: 'Active Search',
      tagline: 'For engineers relocating to the EU',
      price: billingCycle === 'monthly' ? '€19' : '€15',
      period: '/ month',
      features: [
        'Unlimited EU vacancy matching',
        '15 supervised applications / day',
        'EU Blue Card & visa salary radar',
        'OAuth mailbox dispatch',
      ],
      ctaText: 'Start 7-Day Free Trial',
      ctaHref: surfaces.candidateRegister(),
      popular: true,
    },
    {
      id: 'candidate-2',
      category: 'Relocation Elite',
      name: 'Consultant Assisted',
      tagline: 'Concierge support & multi-country routing',
      price: billingCycle === 'monthly' ? '€49' : '€39',
      period: '/ month',
      features: [
        'Everything in Candidate Pro',
        'Assigned relocation consultant',
        'Anabin degree pre-check',
      ],
      ctaText: 'Upgrade to Elite',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
  ];

  // Exact data from http://127.0.0.1:3005/#pricing (Recruiter Portal)
  const recruiterTiers = [
    {
      id: 'recruiter-0',
      category: 'Starter Hire',
      name: 'Team Free',
      tagline: 'Post roles & browse verified talent',
      price: '€0',
      period: '/ forever',
      features: [
        '2 active vacancies',
        'Basic talent pool search',
        'Blue Card salary flags',
      ],
      ctaText: 'Open Recruiter Account',
      ctaHref: surfaces.recruiterLogin(),
      popular: false,
    },
    {
      id: 'recruiter-1',
      category: 'Growth',
      name: 'Recruiter Pro',
      tagline: 'Scale EU tech hiring with verified fits',
      price: billingCycle === 'monthly' ? '€79' : '€63',
      period: '/ month',
      features: [
        'Unlimited vacancies',
        'AI fit scoring on verified facts',
        'Country & stack talent filters',
        'Direct candidate outreach',
      ],
      ctaText: 'Start Recruiter Trial',
      ctaHref: surfaces.recruiterLogin(),
      popular: true,
    },
    {
      id: 'recruiter-2',
      category: 'Enterprise',
      name: 'Agency / Multi-brand',
      tagline: 'Shared seats & compliance reporting',
      price: billingCycle === 'monthly' ? '€199' : '€159',
      period: '/ month',
      features: [
        'Everything in Recruiter Pro',
        'Multi-seat recruiter workspace',
        'Sponsorship audit exports',
      ],
      ctaText: 'Talk to Sales',
      ctaHref: surfaces.recruiterLogin(),
      isEnquiry: true,
      popular: false,
    },
  ];

  const currentTiers = audience === 'candidate' ? candidateTiers : recruiterTiers;
  const isRecruiter = audience === 'recruiter';

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-4 py-16 space-y-12">
          {/* Header & Controls */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Transparent Plans
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {isRecruiter
                ? 'Plans that scale with your hiring team.'
                : 'Plans that scale with your job hunt.'}
            </h1>

            <p className="text-sm text-zinc-600 leading-relaxed">
              {isRecruiter
                ? 'Recruiter pricing matches employer portal. After login, manage your plan under Billing.'
                : 'Candidate pricing matches job seeker portal. After login, manage your plan under Billing.'}
            </p>

            {/* Audience Toggle (Candidate vs Recruiter) with Dynamic Cursor Tracking */}
            <div className="pt-3 flex justify-center">
              <div
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 text-xs font-semibold shadow-sm"
                onMouseLeave={() => setHoveredAudience(null)}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHoveredAudience('candidate')}
                  onClick={() => {
                    setAudience('candidate');
                    setHoveredPricingTier(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-2 transition cursor-pointer ${
                    (hoveredAudience !== null ? hoveredAudience === 'candidate' : audience === 'candidate')
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Job Seekers (Candidate)</span>
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
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Employers &amp; HR (Recruiter)</span>
                </button>
              </div>
            </div>

            {/* Billing Cycle Toggle with Solid Dark Highlight Matching Audience Toggle */}
            <div className="pt-2 flex justify-center">
              <div
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 text-xs font-semibold shadow-sm"
                onMouseLeave={() => setHoveredCycle(null)}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHoveredCycle('monthly')}
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-full px-4 py-1.5 transition cursor-pointer ${
                    (hoveredCycle !== null ? hoveredCycle === 'monthly' : billingCycle === 'monthly')
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
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
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>Yearly</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                      (hoveredCycle !== null ? hoveredCycle === 'yearly' : billingCycle === 'yearly')
                        ? 'bg-emerald-400 text-zinc-950'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
            onMouseLeave={() => setHoveredPricingTier(1)}
          >
            {currentTiers.map((tier, idx) => {
              const isHovered = hoveredPricingTier === idx;

              return (
                <div
                  key={tier.id}
                  onMouseEnter={() => setHoveredPricingTier(idx)}
                  className={`relative rounded-2xl border-2 bg-white p-7 shadow-sm flex flex-col justify-between transition duration-200 ${
                    isHovered
                      ? 'border-zinc-950 shadow-lg outline-transparent'
                      : 'border-transparent outline outline-1 outline-zinc-200/80'
                  }`}
                >
                  {tier.popular && (
                    <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 bg-zinc-950 text-white shadow-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>Most Popular</span>
                    </span>
                  )}

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {tier.category}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-zinc-950">{tier.name}</h3>
                    <p className="mt-2 text-xs text-zinc-500">{tier.tagline}</p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-zinc-900">{tier.price}</span>
                      <span className="text-xs text-zinc-500">{tier.period}</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-zinc-600">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
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
                      className={`mt-8 w-full block text-center rounded-full py-2.5 text-xs font-semibold transition duration-200 cursor-pointer ${
                        isHovered
                          ? 'bg-zinc-950 text-white shadow-sm hover:bg-zinc-800'
                          : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      {tier.ctaText}
                    </button>
                  ) : (
                    <a
                      href={tier.ctaHref}
                      onMouseEnter={() => setHoveredPricingTier(idx)}
                      className={`mt-8 block text-center rounded-full py-2.5 text-xs font-medium transition duration-200 cursor-pointer ${
                        isHovered
                          ? 'bg-zinc-950 text-white shadow-sm hover:bg-zinc-800'
                          : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
                      }`}
                    >
                      {tier.ctaText}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Platform Parity Bar */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-950">100% Platform Price Parity</h4>
                <p className="text-xs text-zinc-500">
                  {isRecruiter
                    ? 'Pricing syncs directly with Employer Console (127.0.0.1:3005/#pricing).'
                    : 'Pricing syncs directly with Candidate Portal (localhost:3003/#pricing).'}
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

          {/* FAQ Accordion Section */}
          <div className="border-t border-zinc-200/80 pt-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">FAQ</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Frequently asked questions.
              </h2>
              <p className="mt-2 text-zinc-600 text-sm">
                {isRecruiter
                  ? 'Everything you need to know about verified talent discovery, Blue Card filters, and direct hire.'
                  : 'Everything you need to know about EU job matching, Blue Card compliance, and verified applications.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  <span>Can I switch between monthly and yearly?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Yes, upgrade or switch billing cycles anytime from your account settings. Unused time is prorated automatically.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-950">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  <span>Do you take placement commissions?</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Never. RightWay is strictly flat-subscription. We take 0% commission from candidates and 0% placement fees from employers.
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
