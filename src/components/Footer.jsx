import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { surfaces } from '../lib/surfaces';
import { ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

function InstagramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function DiscordIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/rightway.ai' },
    { name: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com/company/rightway.ai' },
    { name: 'Discord', icon: DiscordIcon, href: 'https://discord.gg/rightway.ai' },
    { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@rightway.ai' },
    { name: 'X', icon: XIcon, href: 'https://x.com/rightway.ai' },
  ];

  return (
    <footer className="border-t border-zinc-200/80 bg-white py-12 text-zinc-600">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-7 w-7 text-sm" />
              <span className="font-semibold text-base text-zinc-950">RightWay AI</span>
            </Link>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              The ethical AI career platform for European tech mobility. Every fact verified, every visa rule pre-checked, zero hallucinated CV claims.
            </p>

            {/* Social Icons (Instagram, LinkedIn, Discord, YouTube, X) */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="h-8 w-8 rounded-full border border-zinc-200 bg-zinc-50/80 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-white hover:border-zinc-400 hover:scale-110 active:scale-95 transition-all shadow-xs"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <div className="pt-1 flex items-center gap-4 text-xs text-zinc-400">
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
                <Link to="/pricing" className="hover:text-zinc-950 transition font-medium">
                  Plans &amp; Pricing
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
