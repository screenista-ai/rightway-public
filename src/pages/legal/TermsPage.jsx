import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Logo from '../../components/Logo';
import { surfaces } from '../../lib/surfaces';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Floating Navbar */}
      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-3 sm:px-4">
        <div className="glass-card flex items-center justify-between gap-2 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-sm border border-zinc-200/80 bg-white/90 backdrop-blur">
          <Link to="/" className="flex items-center gap-2 font-medium tracking-tight shrink-0">
            <Logo className="h-7 w-7 text-sm" />
            <span className="font-semibold text-sm sm:text-base text-zinc-900">RightWay</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <a
              href={surfaces.candidateRegister()}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              <span>Get Started</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
              <FileText className="h-3.5 w-3.5" />
              <span>Platform Terms</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-zinc-500">Last updated: November 2026</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-zinc-950">1. Supervised Mode A Dispatch</h2>
              <p className="mt-2">
                RightWay operates strictly under human supervision. You authorize every dispatched application individually.
                RightWay does not perform unassisted automated spam submissions.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-950">2. Anti-Spam Ceiling</h2>
              <p className="mt-2">
                To protect employer inbox reputations and maintain European hiring integrity, candidate dispatches are capped
                at a hard limit of 15 targeted applications per calendar day.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-950">3. Deterministic Fact Verification</h2>
              <p className="mt-2">
                Candidates agree to provide authentic documentation. The platform compiles Europass documents solely
                from confirmed facts. Inventions or falsifications of diplomas or employment history will result in account suspension.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
