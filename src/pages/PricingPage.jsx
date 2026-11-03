import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Building,
  User,
} from 'lucide-react';

export default function PricingPage() {
  const [billingType, setBillingType] = useState('candidate'); // 'candidate' | 'employer'
  const [openFaq, setOpenFaq] = useState(0);

  const candidatePlans = [
    {
      name: 'Free Starter',
      price: '€0',
      period: 'forever free',
      desc: 'Everything you need to test your CV and check visa feasibility.',
      features: [
        'Free ATS Resume Diagnostic & Score',
        'EU Blue Card salary floor calculator',
        'Browse all verified European job openings',
        'Verified Candidate Passport creation',
        '5 AI-tailored application drafts',
      ],
      cta: 'Start Free',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
    {
      name: 'Pro Career Copilot',
      price: '€29',
      period: 'per month',
      desc: 'Active job hunting with daily tailored applications and visa checks.',
      features: [
        'Everything in Free Starter',
        'Up to 15 tailored applications daily',
        'Direct personal mailbox dispatch (OAuth)',
        'Legal visa sponsorship & salary hard-gates',
        'Tailored cover letters for European recruiters',
        'Priority matching on unadvertised roles',
      ],
      cta: 'Upgrade to Pro',
      ctaHref: surfaces.candidateRegister(),
      popular: true,
    },
    {
      name: 'Relocation Full Pass',
      price: '€149',
      period: 'one-time payment',
      desc: 'Complete immigration guidance paired with AI job matching.',
      features: [
        'Everything in Pro Copilot (3 months included)',
        'Human document review by licensed consultant',
        'ZAB / Anabin degree equivalency assistance',
        'Consulate appointment checklist preparation',
        'Direct recruiter intro for pre-screened roles',
      ],
      cta: 'Get Relocation Pass',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
  ];

  const employerPlans = [
    {
      name: 'Self-Serve Starter',
      price: '€0',
      period: 'pay per hire',
      desc: 'Post roles and meet pre-verified international tech candidates.',
      features: [
        'Post up to 2 active job openings',
        'Search verified candidate profiles',
        'Zero upfront subscription fees',
        'Standard candidate messaging',
      ],
      cta: 'Create Employer Account',
      ctaHref: surfaces.recruiterRegister(),
      popular: false,
    },
    {
      name: 'Talent Growth',
      price: '€199',
      period: 'per month',
      desc: 'Ideal for scaling teams hiring engineers across EU borders.',
      features: [
        'Unlimited active job postings',
        'Direct access to pre-screened talent pool',
        'Automated Blue Card / IND compliance checks',
        'Direct interview scheduling',
        'Dedicated account manager',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaHref: surfaces.recruiterRegister(),
      popular: true,
    },
    {
      name: 'Enterprise Relocation',
      price: 'Custom',
      period: 'tailored annual contract',
      desc: 'Full-service hiring, relocation concierge, and visa handling.',
      features: [
        'Custom ATS integrations (Greenhouse, Workday)',
        'Complete visa & consular filing handling',
        'Relocation housing & registration support',
        'Guaranteed replacement SLA',
      ],
      cta: 'Contact Employer Sales',
      ctaHref: surfaces.recruiterRegister(),
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Do you charge candidates a percentage of their salary?',
      a: 'Never. RightWay does not take any commission or percentage from your salary. You keep 100% of your earnings. Our pricing is flat and transparent.',
    },
    {
      q: 'Can I cancel my subscription at any time?',
      a: 'Yes. You can cancel your subscription with a single click from your Candidate or Recruiter Settings at any time. There are no lock-in contracts.',
    },
    {
      q: 'How does the personal mailbox dispatch work?',
      a: 'You connect your Gmail or Outlook via secure Google/Microsoft OAuth. RightWay drafts personalized applications, you review and click approve, and the email is sent directly from your address. Recruiter replies arrive in your normal inbox.',
    },
    {
      q: 'What is your refund policy?',
      a: 'We offer a 14-day money-back guarantee on all candidate Pro plans if you are unsatisfied with the quality of your matched roles.',
    },
  ];

  const activePlans = billingType === 'candidate' ? candidatePlans : employerPlans;

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-20 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>Simple, Predictable Plans</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              Transparent Pricing. Zero Hidden Fees.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Choose the right plan for your international tech career or hiring needs. Free to get started, upgrade only when you are ready to apply at scale.
            </p>

            {/* Candidate vs Employer Switcher */}
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white p-1 text-xs font-semibold shadow-sm mt-4">
              <button
                type="button"
                onClick={() => setBillingType('candidate')}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 transition ${
                  billingType === 'candidate'
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>For Job Seekers</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingType('employer')}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 transition ${
                  billingType === 'employer'
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>For Employers & HR</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-7 shadow-sm transition flex flex-col justify-between relative bg-white ${
                  plan.popular
                    ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-md'
                    : 'border-zinc-200/90'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">{plan.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500 min-h-[32px]">{plan.desc}</p>
                  </div>

                  <div className="pt-2 pb-4 border-b border-zinc-100 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight text-zinc-950">{plan.price}</span>
                    <span className="text-xs text-zinc-500 font-medium">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100">
                  <a
                    href={plan.ctaHref}
                    className={`flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-xs font-semibold transition ${
                      plan.popular
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                        : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Banner */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-950">14-Day Satisfaction Guarantee</h4>
                <p className="text-xs text-zinc-500">
                  Try RightWay Pro risk-free. If you don't receive high-compatibility job matches, we provide a full refund.
                </p>
              </div>
            </div>
            <a
              href={surfaces.candidateRegister()}
              className="rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0"
            >
              Get Started Free
            </a>
          </div>

          {/* Pricing FAQ */}
          <div className="space-y-4 pt-6 border-t border-zinc-200/80">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <h3 className="text-2xl font-bold text-zinc-950">Frequently Asked Questions</h3>
              <p className="text-xs text-zinc-500">Everything you need to know about billing, subscriptions, and dispatch.</p>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
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
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

