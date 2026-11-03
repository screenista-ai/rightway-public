import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  Award,
} from 'lucide-react';

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-20 space-y-14">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-zinc-900" />
              <span>RightWay for Employers & Talent Teams</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-950">
              Hire Pre-Verified International Engineers Without Agency Markups
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Stop drowning in bot spam. Meet engineers whose degree recognitions, skills, and visa eligibilities are validated before you open their CV.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={surfaces.recruiterRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-xs font-semibold text-white hover:bg-zinc-800 transition shadow-sm w-full sm:w-auto justify-center"
              >
                <span>Create Employer Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={surfaces.recruiterLogin()}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition w-full sm:w-auto justify-center"
              >
                <span>Employer Sign In</span>
              </a>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm text-center space-y-1">
              <div className="text-3xl font-bold text-zinc-950 tabular-nums">4x Faster</div>
              <div className="text-xs text-zinc-500 font-medium">Time-to-interview vs standard job boards</div>
            </div>
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm text-center space-y-1">
              <div className="text-3xl font-bold text-emerald-700 tabular-nums">0% Hallucinations</div>
              <div className="text-xs text-zinc-500 font-medium">Verified degrees & genuine skill history</div>
            </div>
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm text-center space-y-1">
              <div className="text-3xl font-bold text-zinc-950 tabular-nums">100% Compliance</div>
              <div className="text-xs text-zinc-500 font-medium">Blue Card & IND immigration eligibility check</div>
            </div>
          </div>

          {/* Core Value Pillars */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950">Why Talent Teams Choose RightWay</h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                Traditional job boards charge for volume. RightWay delivers pre-screened precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-950">Pre-Verified Credentials</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Every candidate profile undergoes document verification. Education equivalence (ZAB / anabin) and actual technical tenure are vetted so your team never interviews a fake profile.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-950">Instant Immigration Clearance</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Never waste team screening time on candidates whose offers won't meet legal thresholds. Our built-in immigration engine ensures salaries clear Blue Card (€45,300) and IND standards.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-950">Zero Agency Commissions</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Say goodbye to 20-25% placement invoices. RightWay operates on transparent self-serve plans. Hire as many senior developers as your business requires without markup.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-950">Curated, High-Intent Applications</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Candidates are capped at 15 applications daily, requiring them to review every tailored letter. Applications arrive from their personal mailboxes, guaranteeing serious, responsive candidates.
                </p>
              </div>
            </div>
          </div>

          {/* Employer CTA */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-950 text-white p-8 sm:p-12 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold">Ready to scale your European engineering team?</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Publish your first opening with sponsorship criteria in under two minutes or browse our pre-verified candidate directory.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={surfaces.recruiterRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition shadow-sm"
              >
                <span>Get Started as an Employer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

