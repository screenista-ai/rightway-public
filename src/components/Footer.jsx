import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { surfaces } from '../lib/surfaces';
import { ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white py-12 text-zinc-600">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-7 w-7 text-sm" />
              <span className="font-semibold text-base text-zinc-950">RightWay AI</span>
            </Link>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              The ethical AI career copilot for European tech mobility. Every fact verified, every visa rule pre-checked, zero hallucinated CV claims.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>GDPR Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>EU Blue Card Verified</span>
              </span>
            </div>
          </div>

          {/* Nav: Platform */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-zinc-950 transition">
                  Browse EU Jobs
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="hover:text-zinc-950 transition">
                  Free ATS Resume Checker
                </Link>
              </li>
              <li>
                <Link to="/countries" className="hover:text-zinc-950 transition">
                  Relocation & Visa Guides
                </Link>
              </li>
              <li>
                <Link to="/why-rightway" className="hover:text-zinc-950 transition">
                  Why RightWay (vs Bots)
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-zinc-950 transition">
                  Transparent Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav: For Employers & Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/employers" className="hover:text-zinc-950 transition font-medium">
                  Hire International Talent
                </Link>
              </li>
              <li>
                <a href={surfaces.candidateLogin()} className="hover:text-zinc-950 transition">
                  Candidate Portal Sign In
                </a>
              </li>
              <li>
                <a href={surfaces.recruiterLogin()} className="hover:text-zinc-950 transition">
                  Employer Console Sign In
                </a>
              </li>
              <li>
                <a href={surfaces.candidateRegister()} className="hover:text-zinc-950 transition">
                  Create Free Account
                </a>
              </li>
            </ul>
          </div>

          {/* Nav: Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/legal/gdpr-privacy" className="hover:text-zinc-950 transition">
                  GDPR & Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-zinc-950 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/security" className="hover:text-zinc-950 transition">
                  Security Architecture
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 RightWay AI Technologies. Built in partnership with Right Way Immigration Consultant.</p>
          <p className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>Serving EU, EEA, UK, Switzerland & Global Tech Talent</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

