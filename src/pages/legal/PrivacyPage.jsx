import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Logo from '../../components/Logo';
import { surfaces } from '../../lib/surfaces';

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Shield className="h-3.5 w-3.5" />
              <span>GDPR Compliance Verified</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Privacy Policy & GDPR Statement
            </h1>
            <p className="mt-2 text-xs text-zinc-500">Last updated: November 2026 · Effective across EU & EEA</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-zinc-950">1. Regulatory Framework & Data Controller</h2>
              <p className="mt-2">
                RightWay AI operates under strict compliance with the European General Data Protection Regulation
                (Regulation (EU) 2016/679 - GDPR) Articles 13 and 14. We act as Data Controller for your user account
                and Data Processor for your supervised application dispatches.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-950">2. Encryption at Rest & In Transit</h2>
              <p className="mt-2">
                All uploaded CVs, certificates, and extracted fact entities are encrypted using AES-256-GCM envelope
                encryption with separate key rotation. In-transit communication is strictly guarded by TLS 1.3.
                All primary databases and replica sets reside exclusively within ISO 27001-certified European data centers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-950">3. Article 17 Right to Erasure (&quot;Right to be Forgotten&quot;)</h2>
              <p className="mt-2">
                Candidates maintain complete sovereign control over their records. You may trigger an automated GDPR
                data purge at any time under Settings → Privacy & Security. A purge hard-deletes all uploaded documents,
                OCR transcripts, fact vaults, and tokens within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-zinc-950">4. Supervised Mailbox Access</h2>
              <p className="mt-2">
                OAuth connections to Google Workspace or Microsoft 365 operate strictly under limited scopes. We never
                read personal email threads outside verified application dispatches and candidate-approved replies.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
