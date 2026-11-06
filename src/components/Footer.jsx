import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Marquee from './Marquee';
import PillSwap from './PillSwap';
import { surfaces } from '../lib/surfaces';

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

const EXPLORE = [
  { to: '/jobs', label: 'Jobs' },
  { to: '/ats-checker', label: 'ATS checker' },
  { to: '/countries', label: 'Countries' },
  { to: '/pricing', label: 'Pricing' },
];

const ACCOUNT = [
  { href: surfaces.candidateRegister(), label: 'Create account' },
  { href: surfaces.candidateLogin(), label: 'Candidate sign in' },
  { href: surfaces.recruiterLogin(), label: 'Employer sign in' },
  { to: '/employers', label: 'For employers' },
];

const LEGAL = [
  { to: '/legal/gdpr-privacy', label: 'Privacy' },
  { to: '/legal/terms', label: 'Terms' },
  { to: '/legal/security', label: 'Security' },
  { to: '/why-rightway', label: 'Why RightWay' },
];

export default function Footer() {
  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/rightway.ai' },
    { name: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com/company/rightway.ai' },
    { name: 'Discord', icon: DiscordIcon, href: 'https://discord.gg/rightway.ai' },
    { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@rightway.ai' },
    { name: 'X', icon: XIcon, href: 'https://x.com/rightway.ai' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#070d18] text-white/65">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="rw-rainbow-bar" />

      <div className="relative border-b border-white/10">
        <Marquee
          items={['Germany', 'Netherlands', 'Sweden', 'France', 'Ireland', 'United States', 'Canada', 'Australia', 'New Zealand']}
          speed={36}
          className="py-5 sm:py-6"
          itemClassName="text-2xl sm:text-4xl text-white/25"
          separator="—"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-2xl font-semibold tracking-tight text-white">RightWay</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Sponsored roles. Confirmed facts on the CV. You hit send.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <PillSwap
              tone="inverse"
              className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1"
              defaultActive={0}
              itemClassName="inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-xs font-bold transition cursor-pointer"
            >
              <a href={surfaces.candidateRegister()}>
                Create free account
              </a>
              <Link to="/jobs">
                Browse jobs
              </Link>
            </PillSwap>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6">
            <nav className="space-y-3" aria-label="Explore">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Explore
              </p>
              <ul className="space-y-2.5 text-sm">
                {EXPLORE.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="space-y-3" aria-label="Account">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Account
              </p>
              <ul className="space-y-2.5 text-sm">
                {ACCOUNT.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className="transition hover:text-white">
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="transition hover:text-white">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="space-y-3 col-span-2 sm:col-span-1" aria-label="Legal">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Legal
              </p>
              <ul className="space-y-2.5 text-sm columns-2 sm:columns-1 gap-x-8">
                {LEGAL.map((item) => (
                  <li key={item.to} className="break-inside-avoid">
                    <Link to={item.to} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 sm:mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RightWay</p>
          <p className="sm:text-right">Europe · US · Canada · Australia · New Zealand</p>
        </div>
      </div>
    </footer>
  );
}
