import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import PillSwap from '../components/PillSwap';
import { surfaces } from '../lib/surfaces';
import {
  ShieldCheck,
  Send,
  Ban,
  ArrowRight,
} from 'lucide-react';

const DETAILED_COMPARE = [
  {
    feature: 'CV accuracy',
    bots: 'Invent skills and years to pass filters.',
    agencies: 'Junior edits. Quality swings hard.',
    rightway: 'Only facts you confirmed from documents.',
  },
  {
    feature: 'Visa gate',
    bots: 'Blasts roles that cannot sponsor.',
    agencies: 'Ad-hoc advice. Big retainers.',
    rightway: 'Salary floors and sponsor checks before you send.',
  },
  {
    feature: 'How mail leaves',
    bots: 'Scraper IPs. Looks like spam.',
    agencies: 'Agency forwards with commission markup.',
    rightway: 'Your Google or Microsoft mailbox. Cap 15/day.',
  },
  {
    feature: 'Control',
    bots: 'Auto-applies without your say.',
    agencies: 'Slow. Little visibility.',
    rightway: 'You approve every draft before it goes.',
  },
  {
    feature: 'Recruiter view',
    bots: 'Read as low-effort spam.',
    agencies: 'Fees make teams cautious.',
    rightway: 'Direct, high-intent, visa-checked.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Confirm your facts',
    body: 'Upload degrees, certs, and work history. Lock each claim once.',
  },
  {
    n: '02',
    title: 'Clear the visa floor',
    body: 'Stack, salary thresholds, and sponsorship checked before you draft.',
  },
  {
    n: '03',
    title: 'Review and approve',
    body: 'Cover note and CV stay in your hands until you say go.',
  },
  {
    n: '04',
    title: 'Send from your inbox',
    body: 'Replies land in your mailbox. No middleman.',
  },
];

export default function WhyPage() {
  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent-4)] selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="rw-page-hero">
          <div className="mx-auto max-w-3xl px-4 sm:px-8 text-center space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--rw-muted)]">
              Why RightWay
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--rw-ink)] leading-[1.05]">
              Proof beats polish.
            </h1>
            <p className="text-sm sm:text-base text-[var(--rw-muted)] leading-relaxed max-w-xl mx-auto">
              Fake claims get blacklisted. Volume burns trust. Here: confirmed facts, visa checks, you press send.
            </p>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24 space-y-16 sm:space-y-20">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-6 space-y-3">
                <ShieldCheck className="h-5 w-5 text-[var(--rw-accent)]" />
                <h3 className="font-display text-lg font-semibold text-[var(--rw-ink)]">No invented claims</h3>
                <p className="text-sm text-[var(--rw-muted)] leading-relaxed">
                  Diploma, skill, or date missing? It stays off the CV until you confirm it.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-6 space-y-3">
                <Send className="h-5 w-5 text-[var(--rw-accent-2)]" />
                <h3 className="font-display text-lg font-semibold text-[var(--rw-ink)]">You press send</h3>
                <p className="text-sm text-[var(--rw-muted)] leading-relaxed">
                  Mail leaves Gmail or Outlook from your account. Cap: 15 tailored sends a day.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--rw-line)] rw-surface p-6 space-y-3">
                <Ban className="h-5 w-5 text-[var(--rw-accent-3)]" />
                <h3 className="font-display text-lg font-semibold text-[var(--rw-ink)]">Visa gate first</h3>
                <p className="text-sm text-[var(--rw-muted)] leading-relaxed">
                  Germany Blue Card floor (€45,300) and sponsor checks before you spend a send.
                </p>
              </div>
            </div>
          </Reveal>

          <section className="space-y-6">
            <Reveal>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--rw-ink)] text-center">
                Side by side
              </h2>
              <p className="mt-2 text-sm text-[var(--rw-muted)] text-center max-w-lg mx-auto">
                Auto-apply bots vs agencies vs RightWay.
              </p>
            </Reveal>

            <div className="overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[40rem] rounded-2xl border border-[var(--rw-line)] rw-surface overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[var(--rw-line)] bg-[var(--rw-paper-deep)] text-[11px] font-semibold uppercase tracking-wider text-[var(--rw-muted)]">
                      <th className="py-4 px-4 sm:px-5 w-1/4">Criteria</th>
                      <th className="py-4 px-3 w-1/4 text-[var(--rw-accent-3)]">Auto-apply bots</th>
                      <th className="py-4 px-3 w-1/4 text-[var(--rw-accent-2)]">Agencies</th>
                      <th className="py-4 pl-3 pr-4 sm:pr-5 w-1/4 text-[var(--rw-accent)]">RightWay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rw-line)]">
                    {DETAILED_COMPARE.map((row) => (
                      <tr key={row.feature}>
                        <td className="py-4 px-4 sm:px-5 font-semibold text-[var(--rw-ink)] align-top">{row.feature}</td>
                        <td className="py-4 px-3 text-[var(--rw-muted)] align-top leading-relaxed">{row.bots}</td>
                        <td className="py-4 px-3 text-[var(--rw-muted)] align-top leading-relaxed">{row.agencies}</td>
                        <td className="py-4 pl-3 pr-4 sm:pr-5 text-[var(--rw-ink)] font-medium align-top leading-relaxed">{row.rightway}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="rw-band-ink rounded-2xl px-5 sm:px-10 py-12 sm:py-16 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">Four steps</h3>
              <p className="text-sm text-white/55">
                From first upload to a contract — you stay in control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 space-y-2"
                >
                  <p className="font-display text-3xl text-white/25 tabular-nums">{s.n}</p>
                  <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                  <p className="text-xs text-white/55 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <PillSwap
              tone="inverse"
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              defaultActive={0}
              itemClassName="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold transition cursor-pointer rw-cta-nudge"
            >
              <a href={surfaces.candidateRegister()}>
                <span>Create free account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link to="/jobs">Browse jobs</Link>
            </PillSwap>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
