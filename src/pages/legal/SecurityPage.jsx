import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, KeyRound, Server } from 'lucide-react';
import Logo from '../../components/Logo';
import { surfaces } from '../../lib/surfaces';

export default function SecurityPage() {
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
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Defense-in-Depth Architecture</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Security Architecture & Practices
            </h1>
            <p className="mt-2 text-xs text-zinc-500">Security Invariants & Infrastructure Safeguards</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
            <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5">
              <div className="flex items-center gap-2 text-zinc-950 font-semibold mb-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <h3>1. AES-256 Envelope Encryption</h3>
              </div>
              <p>
                Candidate fact vaults, identity claims, and uploaded CV documents are secured using two-tiered envelope encryption.
                Data encryption keys (DEKs) are generated per record and wrapped by Master Key rings.
              </p>
            </section>

            <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5">
              <div className="flex items-center gap-2 text-zinc-950 font-semibold mb-2">
                <KeyRound className="h-4 w-4 text-emerald-600" />
                <h3>2. Dual-Token Session & Idle Rotation</h3>
              </div>
              <p>
                Short-lived 15-minute access tokens paired with HttpOnly refresh cookies. Single active session enforcement
                with automatic 15-minute sliding inactivity timeouts and revocation on password resets.
              </p>
            </section>

            <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5">
              <div className="flex items-center gap-2 text-zinc-950 font-semibold mb-2">
                <Server className="h-4 w-4 text-emerald-600" />
                <h3>3. Zero AI Hallucination Boundary</h3>
              </div>
              <p>
                Extracted OCR items enter in an unverified state. Zod deterministic schemas and cryptographic fact binding
                prevent language models from injecting false competencies or unearned degrees into Europass PDFs.
              </p>
            </section>

            <section className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5">
              <div className="flex items-center gap-2 text-zinc-950 font-semibold mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3>4. Anti-SSRF & Network Isolation</h3>
              </div>
              <p>
                Outbound ATS webhook dispatchers validate resolved IP ranges via asynchronous DNS checks against IPv4 and IPv6
                private subnets (RFC 1918 / RFC 4193), preventing SSRF and internal port scanning.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
