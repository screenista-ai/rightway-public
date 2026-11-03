import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
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
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                <FileText className="h-3.5 w-3.5" />
                <span>Platform Terms</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                Terms of Service
              </h1>
              <p className="mt-1 text-xs text-zinc-400">Effective Date: November 2, 2026</p>
            </div>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using RightWay AI services, candidate portals, or employer recruiting software, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">2. Ethical Job Application Usage</h2>
              <p>
                RightWay AI is committed to high-intent, respectful recruitment communication. Automated mass spamming, forging certifications or credentials, and sending deceptive communications is strictly prohibited. RightWay enforces rate limits (maximum 15 applications per user per day) to preserve employer deliverability and reputation.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">3. Immigration & Legal Disclaimers</h2>
              <p>
                RightWay AI provides automated diagnostic matching based on statutory thresholds (such as the German EU Blue Card salary floor). Our automated tools do not constitute formal legal immigration advice. Official visa granting authority rests solely with the competent embassies, consulates, and immigration authorities (Ausländerbehörde, IND, Migrationsverket).
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <h2 className="text-base font-semibold text-zinc-900">4. Subscriptions & Cancellations</h2>
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
