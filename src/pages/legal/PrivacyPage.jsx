import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-ink)] selection:text-[var(--rw-paper)] flex flex-col justify-between">

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-3xl px-4 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--rw-muted)] hover:text-[var(--rw-ink)] transition mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="rounded-3xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <Shield className="h-3.5 w-3.5" />
                <span>GDPR Compliance Verified</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--rw-ink)]">
                GDPR & Privacy Notice
              </h1>
              <p className="mt-1 text-xs text-[var(--rw-muted)]">Version 2026-11-02 · RightWay</p>
            </div>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">1. Data Controller & Scope</h2>
              <p>
                RightWay acts as the data controller for personal information collected when you register, check visa eligibility, or build a CV profile. We process your data under Article 6(1)(b) GDPR for contract performance and Article 6(1)(a) for explicit consent.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">2. Fact Verification & No Hallucination</h2>
              <p>
                RightWay does not invent claims. Information taken from diplomas, work certificates, and language scores stays scoped to documents you upload. Empty fields stay empty until you provide documentation.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">3. Mailbox Access & Personal Dispatch</h2>
              <p>
                When connecting your Gmail or Outlook account via OAuth, RightWay only utilizes permissions required to draft and send applications that you explicitly approve. We never read incoming personal correspondence unrelated to recruitment responses, and we never sell candidate email addresses to third-party data brokers.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">4. Your GDPR Rights</h2>
              <p>
                Under Articles 15–22 of the GDPR, you have the right to access your personal data, rectify inaccurate records, request erasure ("Right to be Forgotten"), and export your profile in a machine-readable JSON format. You can execute these rights directly from your Account Settings or by emailing privacy@rightway.ai.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
