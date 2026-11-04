import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { surfaces } from '../lib/surfaces';
import {
  ShieldCheck,
  Send,
  Ban,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  FileCheck,
} from 'lucide-react';

const DETAILED_COMPARE = [
  {
    feature: 'CV Accuracy & Integrity',
    bots: 'AI hallucinates gaps, fabricates fake years of experience, and stuffs keywords indiscriminately.',
    agencies: 'Manual editing by junior consultants, often varying wildly in quality and technical depth.',
    rightway: 'Zero hallucinated facts. Only confirmed, document-backed credentials can ever appear on your CV.',
  },
  {
    feature: 'Visa & Immigration Gating',
    bots: 'None. Spams 100+ companies blindly even if the employer explicitly lacks visa sponsorship licenses.',
    agencies: 'Ad-hoc manual advice, often charging thousands of euros in upfront retainer fees.',
    rightway: 'Automated verification against Blue Card salary floors, IND licenses, and legal sponsor registers first.',
  },
  {
    feature: 'Dispatch Mechanism',
    bots: 'Mass automated blast from untrusted scraper IPs, causing corporate email firewalls to mark you as spam.',
    agencies: 'Agency forwards resume to generic HR mailboxes with heavy commission markup (15-25% salary).',
    rightway: 'Sent directly from your own authenticated mailbox (OAuth), capped at 15 high-quality sends per day.',
  },
  {
    feature: 'Candidate Control',
    bots: 'Zero. Bots auto-apply in background without showing you where or when your profile was sent.',
    agencies: 'Slow turnaround times, limited transparency into employer communication.',
    rightway: 'You approve every single email draft and customized CV before anything is dispatched.',
  },
  {
    feature: 'Recruiter Perception',
    bots: 'Instantly recognized as low-effort spam and blacklisted in Applicant Tracking Systems.',
    agencies: 'Treated with caution due to heavy agency placement fees.',
    rightway: 'Received as verified, high-intent direct talent with pre-evaluated visa eligibility.',
  },
];

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20 space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>Enterprise AI Architecture</span>
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950">
              Why RightWay Outperforms Auto-Apply Bots & Agencies
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Most job search tools try to game algorithms with volume and fake claims. In European hiring, that gets you blacklisted. RightWay does the opposite: precision, proof, and personal control.
            </p>
          </div>

          {/* Three Core Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950">Zero Hallucinations</h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                If you haven’t verified a diploma, skill, or tenure date, our AI refuses to inject it. Your credibility in technical interviews remains bulletproof.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950">You Press Send</h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Applications leave directly from your personal Gmail or Outlook address, capped at 15 tailored submissions daily. No bot spam signatures.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                <Ban className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950">Visa Hard Gate</h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                We check legal salary floors (€45,300 for German Blue Card) and verify employer sponsorship authorization before you spend an application token.
              </p>
            </div>
          </div>

          {/* Detailed Side by Side Comparison Table */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-950 text-center">Comprehensive Platform Comparison</h2>
            <p className="text-xs sm:text-sm text-zinc-500 text-center max-w-xl mx-auto">
              How RightWay compares to mass-automation bots and traditional commission-driven agencies.
            </p>

            <div className="mt-6 overflow-x-auto rounded-3xl border border-zinc-200/90 bg-white shadow-sm">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 uppercase tracking-wider text-zinc-500 text-[11px] font-semibold">
                    <th className="px-5 py-4 w-1/4">Criteria</th>
                    <th className="px-5 py-4 w-1/4 text-red-600">Auto-Apply Bots</th>
                    <th className="px-5 py-4 w-1/4 text-amber-700">Relocation Agencies</th>
                    <th className="px-5 py-4 w-1/4 text-emerald-800 bg-emerald-50/40">RightWay AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {DETAILED_COMPARE.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition">
                      <td className="px-5 py-4 font-semibold text-zinc-950 align-top">{row.feature}</td>
                      <td className="px-5 py-4 text-zinc-500 align-top leading-relaxed">{row.bots}</td>
                      <td className="px-5 py-4 text-zinc-500 align-top leading-relaxed">{row.agencies}</td>
                      <td className="px-5 py-4 text-zinc-900 font-medium bg-emerald-50/20 align-top leading-relaxed">
                        {row.rightway}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Workflow Steps */}
          <div className="rounded-3xl border border-zinc-200 bg-zinc-950 text-white p-8 sm:p-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-semibold">The 4-Step Verified Workflow</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Transparent and compliant from your first resume scan to signing an EU contract.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <span className="h-8 w-8 rounded-full bg-white text-zinc-950 font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <h4 className="font-semibold text-white text-sm">Verify Credentials</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upload your degree, certificates, and work history. Verify each fact against documents once.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <span className="h-8 w-8 rounded-full bg-white text-zinc-950 font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <h4 className="font-semibold text-white text-sm">AI Hard Gate Match</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Our system evaluates tech stack, visa sponsorship eligibility, and minimum salary thresholds.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <span className="h-8 w-8 rounded-full bg-white text-zinc-950 font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <h4 className="font-semibold text-white text-sm">Review & Approve</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every cover note and tailored CV is drafted for your review. You maintain 100% send authority.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
                <span className="h-8 w-8 rounded-full bg-white text-zinc-950 font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <h4 className="font-semibold text-white text-sm">Personal Mailbox Send</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sent from your own email. Recruiter replies come straight to your inbox without intermediaries.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <a
                href={surfaces.candidateRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition shadow-sm"
              >
                <span>Create Your Verified Profile</span>
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

