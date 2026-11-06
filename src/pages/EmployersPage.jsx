import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillSwap from '../components/PillSwap.jsx';
import { surfaces } from '../lib/surfaces';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Clock,
} from 'lucide-react';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Confirmed credentials',
    body: 'Degrees and tenure checked against documents before you interview.',
  },
  {
    icon: CheckCircle2,
    title: 'Visa floors first',
    body: 'Salary checked against Blue Card (€45,300) and IND-style thresholds before your team screens.',
  },
  {
    icon: TrendingDown,
    title: 'No agency cut',
    body: 'Flat plans. Hire without 20–25% placement invoices.',
  },
  {
    icon: Clock,
    title: 'High-intent mail',
    body: 'Candidates cap at 15 sends/day from their own mailbox — serious, responsive applications.',
  },
];

export default function EmployersPage() {
  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-accent-4)] selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="rw-page-hero">
          <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rw-accent-4)]/30 bg-[var(--rw-violet-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--rw-accent-4)] shadow-sm">
              <Building2 className="h-3.5 w-3.5" />
              <span>For employers</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[var(--rw-ink)]">
              Hire engineers. Skip the agency cut.
            </h1>
            <p className="text-sm sm:text-base text-[var(--rw-muted)] leading-relaxed max-w-2xl mx-auto">
              Degrees, skills, and visa fit checked before you open the CV.
            </p>
          </div>
        </div>

        <main className="relative z-10 mx-auto max-w-5xl px-4 pt-10 pb-20 space-y-14">
          <div className="text-center">
            <PillSwap
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
              defaultActive={0}
              itemClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <a href={surfaces.recruiterRegister()}>
                <span>Create employer account</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
              <a href={surfaces.recruiterLogin()}>
                <span>Employer sign in</span>
              </a>
            </PillSwap>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '4x', l: 'Faster time-to-interview vs boards' },
              { n: '0%', l: 'Invented claims on confirmed profiles' },
              { n: '100%', l: 'Visa floor checks before screen' },
            ].map((m) => (
              <div
                key={m.n}
                className="rounded-3xl border border-[var(--rw-line)] rw-surface p-6 text-center space-y-1"
              >
                <div className="text-3xl font-bold text-[var(--rw-ink)] tabular-nums font-display">{m.n}</div>
                <div className="text-xs text-[var(--rw-muted)] font-medium">{m.l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--rw-ink)]">
                Why teams use RightWay
              </h2>
              <p className="text-sm text-[var(--rw-muted)]">
                Boards sell volume. You get confirmed fit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PILLARS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="border-t border-[var(--rw-line)] pt-6 space-y-3"
                >
                  <Icon className="h-5 w-5 text-[var(--rw-accent)]" />
                  <h3 className="text-base font-semibold text-[var(--rw-ink)]">{title}</h3>
                  <p className="text-sm text-[var(--rw-muted)] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rw-band-ink p-8 sm:p-12 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white">
              Post a role. Meet real candidates.
            </h3>
            <p className="text-sm text-white/55 max-w-xl mx-auto">
              Add sponsorship criteria, then browse candidates with confirmed documents.
            </p>
            <a
              href={surfaces.recruiterRegister()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-[#0a0a0a] hover:bg-[#f4f1ea] transition"
            >
              <span>Create employer account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
