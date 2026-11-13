import React from 'react';
import { FileText } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen rw-paper-wash text-[var(--rw-ink)] selection:bg-[var(--rw-ink)] selection:text-[var(--rw-paper)] flex flex-col justify-between">

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                <FileText className="h-3.5 w-3.5" />
                <span>Platform Terms</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--rw-ink)]">
                Terms of Service
              </h1>
              <p className="mt-1 text-xs text-[var(--rw-muted)]">Effective Date: November 2, 2026</p>
            </div>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using RightWay services, candidate portals, or employer recruiting software, you agree to these Terms of Service. If you enter this agreement on behalf of a company or other legal entity, you confirm you have authority to bind that entity.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">2. Ethical Job Application Usage</h2>
              <p>
                Mass spam, forged credentials, and deceptive messages are prohibited. RightWay caps applications at 15 per user per day to protect deliverability.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">3. Immigration & Legal Disclaimers</h2>
              <p>
                RightWay checks statutory thresholds such as the German EU Blue Card salary floor. These tools are not formal immigration advice. Visa decisions rest with embassies, consulates, and immigration authorities (Ausländerbehörde, IND, Migrationsverket).
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">4. Subscriptions & Cancellations</h2>
              <p>
                Candidate and employer subscription fees are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time with immediate effect for future billing periods. Candidate Pro plans are backed by a 14-day money-back guarantee.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
