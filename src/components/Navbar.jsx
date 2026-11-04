import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Briefcase, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { surfaces } from '../lib/surfaces';

export const NAV_ITEMS = [
  { path: '/jobs', label: 'Jobs', badge: 'Live' },
  { path: '/ats-checker', label: 'ATS Checker' },
  { path: '/countries', label: 'Countries' },
  { path: '/why-rightway', label: 'Why RightWay' },
  { path: '/employers', label: 'Employers' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setLoginMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const currentPath = location.pathname;

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-3 sm:px-5">
      <div className="navbar glass-card relative flex items-center justify-between flex-nowrap gap-4 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm border border-zinc-200/80 bg-white/90 backdrop-blur">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-medium tracking-tight shrink-0 whitespace-nowrap">
          <Logo className="h-7 w-7 text-sm shrink-0" />
          <span className="font-semibold text-sm sm:text-base text-zinc-950 whitespace-nowrap">RightWay AI</span>
        </Link>

        {/* Desktop Navigation - Strictly One Line & Non-wrapping */}
        <nav className="nav-links hidden lg:flex items-center justify-center flex-nowrap whitespace-nowrap text-sm font-medium text-zinc-600">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative shrink-0 whitespace-nowrap py-1 transition flex items-center gap-1.5 hover:text-zinc-950 ${
                  isActive ? 'text-zinc-950 font-semibold' : 'text-zinc-600'
                }`}
              >
                <span className="whitespace-nowrap leading-none">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 leading-none shrink-0 whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-zinc-900" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons - Aligned on the Right */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap whitespace-nowrap">
          {/* Sign In Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLoginMenuOpen((v) => !v)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shrink-0 whitespace-nowrap leading-none"
            >
              <span className="whitespace-nowrap">Sign In</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform shrink-0 ${loginMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {loginMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 text-xs"
                onMouseLeave={() => setLoginMenuOpen(false)}
              >
                <a
                  href={surfaces.candidateLogin()}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-100 font-medium"
                >
                  <User className="h-4 w-4 text-zinc-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-zinc-900 whitespace-nowrap">Job Seeker Sign In</div>
                    <div className="text-[10px] text-zinc-500 whitespace-nowrap">Candidate Portal</div>
                  </div>
                </a>
                <a
                  href={surfaces.recruiterLogin()}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-100 font-medium mt-1"
                >
                  <Briefcase className="h-4 w-4 text-zinc-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-zinc-900 whitespace-nowrap">Employer Sign In</div>
                    <div className="text-[10px] text-zinc-500 whitespace-nowrap">Recruiter Console</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <a
            href={surfaces.candidateRegister()}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 shrink-0 whitespace-nowrap leading-none"
          >
            <span className="whitespace-nowrap">Start Free</span>
            <ArrowRight className="h-3.5 w-3.5 hidden sm:inline shrink-0" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-50 active:scale-95 transition shrink-0"
          >
            {mobileOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur p-4 shadow-xl space-y-3">
          <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition ${
                    isActive ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'hover:bg-zinc-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-1">
              Account Access
            </div>
            <a
              href={surfaces.candidateLogin()}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              <span>Candidate Portal Sign In</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </a>
            <a
              href={surfaces.recruiterLogin()}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              <span>Employer Sign In</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
            </a>
            <a
              href={surfaces.candidateRegister()}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
