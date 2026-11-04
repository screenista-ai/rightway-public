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
  Building,
  User,
  Zap,
} from 'lucide-react';

export default function PricingPage() {
  const [billingType, setBillingType] = useState('candidate'); // 'candidate' | 'employer'
  const [openFaq, setOpenFaq] = useState(0);

  // Exact match with rightway-candidate/src/pages/portal/BillingPage.jsx
  const candidatePlans = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      period: 'forever free',
      blurb: 'Explore matches + ATS check',
      features: [
        '15 matches / month',
        'Free ATS resume check',
        'Europass CV export',
        'Fact Vault credential storage',
        'EU Blue Card salary floor check',
      ],
      cta: 'Start Free',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€19',
      period: 'per month',
      blurb: 'Serious EU job hunt',
      features: [
        'Unlimited matches',
        'Auto-apply by fit score',
        'Priority ATS templates',
        'Visa sponsorship verification',
        'Tailored cover letter variations',
      ],
      cta: 'Choose Pro',
      ctaHref: surfaces.candidateRegister(),
      popular: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '€49',
      period: 'per month',
      blurb: 'Full supervised dispatch',
      features: [
        'Everything in Pro',
        '15 dispatches / day',
        'Personal Mailbox OAuth (Gmail/Outlook)',
        'Direct recruiter inbox delivery',
        'Priority immigration review',
      ],
      cta: 'Choose Elite',
      ctaHref: surfaces.candidateRegister(),
      popular: false,
    },
  ];

  // Exact match with rightway-recruiter/src/pages/recruiter/BillingPage.jsx
  const employerPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '€79',
      period: 'per month',
      blurb: 'Post roles + pipeline',
      features: [
        '3 active vacancies',
        'Applied / Shortlisted / Rejected pipeline',
        'Verified company profile',
        'Pre-verified credential screening',
        'Direct applicant messaging',
      ],
      cta: 'Choose Starter',
      ctaHref: surfaces.recruiterRegister(),
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€199',
      period: 'per month',
      blurb: 'Hiring team workspace',
      features: [
        'Unlimited job posts',
        'Talent pool search',
        'Multi-seat ready (HR + Hiring Mgr)',
        'EU Blue Card & IND compliance filters',
        'Priority candidate outreach',
        'Dedicated account manager',
      ],
      cta: 'Choose Pro Workspace',
      ctaHref: surfaces.recruiterRegister(),
      popular: true,
    },
  ];

  const faqs = [
    {
      q: 'Do candidate plans match the portal pricing?',
      a: 'Yes, 100%. The Free plan (€0), Pro plan (€19/mo), and Elite plan (€49/mo) match the candidate portal billing dashboard exactly.',
    },
    {
      q: 'Do employer plans match the recruiter console pricing?',
      a: 'Yes. The Starter plan (€79/mo) and Pro workspace plan (€199/mo) reflect the exact subscription tiers in the recruiter console.',
    },
    {
      q: 'How does personal mailbox dispatch work?',
      a: 'In the Elite candidate plan, you connect your personal Google Workspace or Microsoft 365 mailbox via OAuth. Applications are sent directly from your email address capped at 15/day for anti-spam compliance.',
    },
    {
      q: 'Can I cancel or switch tiers anytime?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time with a single click inside your account settings.',
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900 animate-spin-slow" />
              <span>Transparent & Aligned Plans</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950">
              Simple, Predictable Plans.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Pricing matches candidate and recruiter portals. No hidden commission, no surprise invoices.
            </p>

            {/* Animated Interactive Role Switcher */}
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100/80 p-1.5 text-xs font-semibold shadow-inner mt-4 transition-all">
              <button
                type="button"
                onClick={() => setBillingType('candidate')}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 ${
                  billingType === 'candidate'
                    ? 'bg-zinc-900 text-white shadow-md scale-100'
                    : 'text-zinc-600 hover:text-zinc-950 scale-95'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Job Seekers (Candidate)</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingType('employer')}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 ${
                  billingType === 'employer'
                    ? 'bg-zinc-900 text-white shadow-md scale-100'
                    : 'text-zinc-600 hover:text-zinc-950 scale-95'
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Employers & HR (Recruiter)</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid with Animated Fade In */}
          <div
            key={billingType}
            className={`grid gap-6 animate-fade-in-scale ${
              billingType === 'candidate'
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
            }`}
          >
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className={`group rounded-3xl border p-7 transition-all duration-300 ease-out flex flex-col justify-between relative bg-white hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular
                    ? 'border-zinc-950 ring-2 ring-zinc-900/10 shadow-lg pulse-glow'
                    : 'border-zinc-200/90 shadow-sm hover:border-zinc-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <Zap className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {plan.name}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 min-h-[32px]">{plan.blurb}</p>
                  </div>

                  <div className="pt-2 pb-4 border-b border-zinc-100 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-zinc-950 transition group-hover:scale-105 inline-block origin-left">
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition group-hover:scale-110" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100">
                  <a
                    href={plan.ctaHref}
                    className={`flex items-center justify-center gap-2 w-full rounded-full py-2.5 text-xs font-semibold transition-all duration-200 transform active:scale-95 ${
                      plan.popular
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:shadow-md'
                        : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Satisfaction Guarantee Banner */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 animate-pulse">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-950">14-Day Money-Back Guarantee</h4>
                <p className="text-xs text-zinc-500">
                  Test RightWay risk-free. If you don&apos;t experience faster, verified applications, receive a prompt full refund.
                </p>
              </div>
            </div>
            <a
              href={billingType === 'candidate' ? surfaces.candidateRegister() : surfaces.recruiterRegister()}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition shrink-0 shadow-sm active:scale-95"
            >
              Get Started Now
            </a>
          </div>

          {/* Pricing FAQ with Animated Accordion */}
          <div className="space-y-4 pt-6 border-t border-zinc-200/80">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <h3 className="text-2xl font-bold text-zinc-950">Frequently Asked Questions</h3>
              <p className="text-xs text-zinc-500">
                Common questions regarding plans, dispatch limits, and portal billing.
              </p>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-zinc-950 hover:bg-zinc-50/50 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-zinc-900' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                        {faq.a}
                      </div>
                    </div>
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
