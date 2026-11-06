import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, KeyRound, Server } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SecurityPage() {
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
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Defense-in-Depth Architecture</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--rw-ink)]">
                Security & Data Protection
              </h1>
              <p className="mt-1 text-xs text-[var(--rw-muted)]">Published November 2026</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)] p-4 space-y-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-muted)]">Argon2id Hashing</h3>
                <p className="text-xs text-[var(--rw-muted)]">
                  OWASP-recommended memory-hard key derivation prevents brute-force credential attacks.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)] p-4 space-y-2">
                <KeyRound className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-muted)]">Short-Lived JWTs</h3>
                <p className="text-xs text-[var(--rw-muted)]">
                  15-minute access tokens with HttpOnly secure sliding refresh cookies.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-paper-deep)] p-4 space-y-2">
                <Server className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-muted)]">AES-256 Envelope</h3>
                <p className="text-xs text-[var(--rw-muted)]">
                  Per-file envelope encryption ensures sensitive identity documents remain encrypted at rest.
                </p>
              </div>
            </div>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">1. Data Storage & Encryption at Rest</h2>
              <p>
                All sensitive documents, passport identity scans, and degrees are stored in private S3/local-isolated object stores protected by AES-256 envelope encryption. Decryption keys are rotated continuously and stored separately from encrypted assets.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">2. Transport Security & Session Isolation</h2>
              <p>
                All traffic is strictly encrypted in transit using TLS 1.3. Refresh tokens are scoped to single devices with active session IDs (`sid`). New logins invalidate prior sessions to prevent session hijacking.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm text-[var(--rw-muted)] leading-relaxed">
              <h2 className="text-base font-semibold text-[var(--rw-ink)]">3. Continuous Audit Logging</h2>
              <p>
                Administrative actions, role privilege escalations, and GDPR data requests generate immutable records in the system `AuditLog` collection, tracking actor ID, action type, IP address, and timestamp.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
