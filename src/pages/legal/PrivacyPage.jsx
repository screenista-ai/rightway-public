import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="fixed inset-0 pointer-events-none bg-grid-subtle opacity-70 z-0" />

      <div>
        <Navbar />

        <main className="relative z-10 mx-auto max-w-3xl px-4 py-12">
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
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                GDPR & Privacy Notice
              </h1>
              <p className="mt-1 text-xs text-zinc-400">Version 2026-11-02 · RightWay AI Technologies</p>
            </div>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">1. Data Controller & Scope</h2>
              <p>
                RightWay AI acts as the data controller for personal information collected when you register, evaluate your visa eligibility, or build a verified European CV profile. We process your data strictly under Article 6(1)(b) of the EU General Data Protection Regulation (GDPR) for contract performance and Article 6(1)(a) for explicit consent.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">2. Fact Verification & No Hallucination</h2>
              <p>
                Unlike generic LLM resume bots, RightWay AI does not invent or hallucinate claims. Information extracted from diplomas, work certificates, and language scores remains strictly scoped to verified documents you upload. Empty fields remain empty unless you provide documentation.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">3. Mailbox Access & Personal Dispatch</h2>
              <p>
                When connecting your Gmail or Outlook account via OAuth, RightWay only utilizes permissions required to draft and send applications that you explicitly approve. We never read incoming personal correspondence unrelated to recruitment responses, and we never sell candidate email addresses to third-party data brokers.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">4. Your GDPR Rights</h2>
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
