import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  User,
  Briefcase,
  ArrowRight,
  UserRound,
  Settings,
  KeyRound,
  Mail,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';
import { surfaces } from '../lib/surfaces';
import EnquiryModal from './EnquiryModal';
import ThemeToggle from './ThemeToggle';

export const NAV_ITEMS = [
  { path: '/jobs', label: 'Jobs', badge: 'Live' },
  { path: '/countries', label: 'Countries' },
  { path: '/why-rightway', label: 'Why RightWay' },
  { path: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [candidateMenuOpen, setCandidateMenuOpen] = useState(false);

  // Dynamic cursor tracking for highlight shift
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredMobileNav, setHoveredMobileNav] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);

  // Authenticated candidate state
  const [candidateUser, setCandidateUser] = useState(null);
  const candidateMenuRef = useRef(null);

  useEffect(() => {
    function checkCandidateAuth() {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('user_role');
      const name = localStorage.getItem('user_name');
      if (token && role === 'CANDIDATE') {
        setCandidateUser({
          name: name || 'Candidate',
          firstName: (name || 'Candidate').split(' ')[0],
          initials: (name || 'Candidate')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || 'C',
        });
      } else {
        setCandidateUser(null);
      }
    }
    checkCandidateAuth();
    window.addEventListener('storage', checkCandidateAuth);
    return () => window.removeEventListener('storage', checkCandidateAuth);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLoginMenuOpen(false);
    setCandidateMenuOpen(false);
    setHoveredNav(null);
    setHoveredMobileNav(null);
    setHoveredAction(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Click outside candidate menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (candidateMenuRef.current && !candidateMenuRef.current.contains(e.target)) {
        setCandidateMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSignOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setCandidateUser(null);
    setCandidateMenuOpen(false);
    window.location.href = surfaces.candidateLogin();
  }

  const currentPath = location.pathname;

  return (
    <>
      <header className="sticky top-0 z-50 mx-auto max-w-6xl px-3 sm:px-5 pt-2 sm:pt-3 safe-top">
        <div className="navbar relative flex items-center justify-between flex-nowrap gap-1.5 sm:gap-4 rounded-full px-2.5 sm:px-5 py-1.5 sm:py-2 border border-white/15 bg-[var(--rw-nav-bg)] backdrop-blur-xl shadow-sm">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-medium tracking-tight shrink-0 whitespace-nowrap">
            <Logo className="h-6 w-6 text-sm shrink-0" />
            <span className="font-display font-semibold text-sm sm:text-[15px] text-[var(--rw-nav-ink)] whitespace-nowrap">RightWay</span>
          </Link>

          {/* Desktop Navigation - Strictly One Line & Non-wrapping with Cursor Highlight Tracking */}
          <nav
            className="hidden lg:flex items-center justify-center flex-nowrap whitespace-nowrap text-[13px] font-medium text-[var(--rw-nav-muted)] gap-0.5"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isCurrent = currentPath === item.path;
              const isHovered = hoveredNav === item.path;
              const isHighlighted = hoveredNav !== null ? isHovered : isCurrent;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredNav(item.path)}
                  className={`rounded-full px-3 py-1.5 transition-all duration-150 whitespace-nowrap leading-none ${
                    isHighlighted
                      ? 'bg-[var(--rw-nav-hover)] text-[var(--rw-nav-ink)] font-semibold'
                      : 'hover:text-[var(--rw-nav-ink)] hover:bg-[var(--rw-nav-hover)]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    {item.label}
                    {item.badge && (
                      <span className={`rounded-full text-[10px] font-bold px-1.5 py-0.2 shrink-0 leading-tight transition-colors ${
                        isHighlighted ? 'bg-emerald-200 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs - Non-wrapping and fixed */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            <ThemeToggle />
            {candidateUser ? (
              /* Authenticated Candidate Nav Profile Dropdown */
              <div className="relative shrink-0 hidden lg:block" ref={candidateMenuRef}>
                <button
                  type="button"
                  onClick={() => setCandidateMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1 pr-3 shadow-sm hover:bg-white/15 transition cursor-pointer"
                  aria-expanded={candidateMenuOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--rw-accent)] text-[11px] font-bold text-white tracking-wide">
                    {candidateUser.initials}
                  </div>
                  <span className="text-xs font-semibold text-[var(--rw-nav-ink)] truncate max-w-[120px]">
                    {candidateUser.firstName}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[var(--rw-nav-muted)] transition-transform duration-200 ${
                      candidateMenuOpen ? 'rotate-180 text-[var(--rw-nav-ink)]' : ''
                    }`}
                  />
                </button>

                {candidateMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-1.5 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-100 divide-y divide-[var(--rw-line)]">
                    <div className="px-3 py-2">
                      <p className="font-bold text-[var(--rw-ink)] truncate">{candidateUser.name}</p>
                      <p className="text-[11px] text-[var(--rw-muted)]">Candidate Portal</p>
                    </div>

                    <div className="py-1">
                      <a
                        href={surfaces.candidateProfile()}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] hover:text-[var(--rw-ink)] font-medium transition"
                      >
                        <UserRound className="h-4 w-4 text-[var(--rw-muted)]" />
                        <span>My Profile</span>
                      </a>
                      <a
                        href={surfaces.candidateSettings()}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] hover:text-[var(--rw-ink)] font-medium transition"
                      >
                        <Settings className="h-4 w-4 text-[var(--rw-muted)]" />
                        <span>Account Settings</span>
                      </a>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] font-medium transition text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-[var(--rw-muted)]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out: Split Login Dropdown Button (Desktop) */
              <div className="relative shrink-0 hidden lg:block">
                <button
                  type="button"
                  onClick={() => setLoginMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-[var(--rw-nav-ink)] shadow-sm transition hover:bg-white/15 active:scale-95 shrink-0 whitespace-nowrap leading-none cursor-pointer"
                >
                  <span>Sign In</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--rw-nav-muted)] shrink-0" />
                </button>

                {loginMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--rw-line)] bg-[var(--rw-surface)] p-2 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setLoginMenuOpen(false)}
                  >
                    <a
                      href={surfaces.candidateLogin()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] font-medium"
                    >
                      <User className="h-4 w-4 text-[var(--rw-muted)] shrink-0" />
                      <div>
                        <div className="font-semibold text-[var(--rw-ink)] whitespace-nowrap">Candidate Portal</div>
                        <div className="text-[10px] text-[var(--rw-muted)] whitespace-nowrap">Job Seekers & Applicants</div>
                      </div>
                    </a>
                    <a
                      href={surfaces.recruiterLogin()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)] font-medium mt-1"
                    >
                      <Briefcase className="h-4 w-4 text-[var(--rw-muted)] shrink-0" />
                      <div>
                        <div className="font-semibold text-[var(--rw-ink)] whitespace-nowrap">Employer Sign In</div>
                        <div className="text-[10px] text-[var(--rw-muted)] whitespace-nowrap">Recruiter Console</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Primary CTA: Enquire Now (Desktop) */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[var(--rw-accent)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--rw-accent-2)] shrink-0 whitespace-nowrap leading-none cursor-pointer"
            >
              <span className="whitespace-nowrap">Enquire Now</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-1.5 text-[var(--rw-nav-ink)] hover:bg-white/15 active:scale-95 transition shrink-0 cursor-pointer"
            >
              {mobileOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl border border-white/15 bg-[var(--rw-nav-bg)] backdrop-blur-xl p-4 shadow-xl space-y-3">
            <nav
              className="flex flex-col gap-1 text-sm font-medium text-[var(--rw-nav-muted)]"
              onMouseLeave={() => setHoveredMobileNav(null)}
            >
              {NAV_ITEMS.map((item) => {
                const isCurrent = currentPath === item.path;
                const isHovered = hoveredMobileNav === item.path;
                const isHighlighted = hoveredMobileNav !== null ? isHovered : isCurrent;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setHoveredMobileNav(item.path)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
                      isHighlighted
                        ? 'bg-[var(--rw-nav-hover)] text-[var(--rw-nav-ink)] font-semibold shadow-2xs'
                        : 'text-[var(--rw-nav-muted)] hover:text-[var(--rw-nav-ink)] hover:bg-[var(--rw-nav-hover)]'
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

            <div
              className="pt-2 border-t border-[var(--rw-line)] flex flex-col gap-2"
              onMouseLeave={() => setHoveredAction(null)}
            >
              {candidateUser ? (
                /* Authenticated Mobile User Section */
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[var(--rw-paper-deep)] rounded-xl mb-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--rw-ink)] text-[11px] font-bold text-white">
                      {candidateUser.initials}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-[var(--rw-ink)] truncate">{candidateUser.name}</div>
                      <div className="text-[10px] text-[var(--rw-muted)]">Candidate Account</div>
                    </div>
                  </div>

                  <a
                    href={surfaces.candidateProfile()}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]"
                  >
                    <span>My Profile</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--rw-muted)]" />
                  </a>
                  <a
                    href={surfaces.candidateSettings()}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]"
                  >
                    <span>Account Settings</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--rw-muted)]" />
                  </a>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <span>Sign Out</span>
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                /* Logged-out Mobile Account Access with Dynamic Cursor Shift */
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--rw-muted)] px-1">
                    Account Access
                  </div>
                  <a
                    href={surfaces.candidateLogin()}
                    onMouseEnter={() => setHoveredAction('candidate')}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 border ${
                      hoveredAction === 'candidate'
                        ? 'bg-[var(--rw-ink)] text-white border-[var(--rw-ink)] shadow-sm'
                        : 'border-[var(--rw-line)] bg-[var(--rw-surface)] text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]'
                    }`}
                  >
                    <span>Candidate Portal Sign In</span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        hoveredAction === 'candidate' ? 'translate-x-0.5 text-white' : 'text-[var(--rw-muted)]'
                      }`}
                    />
                  </a>
                  <a
                    href={surfaces.recruiterLogin()}
                    onMouseEnter={() => setHoveredAction('recruiter')}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 border ${
                      hoveredAction === 'recruiter'
                        ? 'bg-[var(--rw-ink)] text-white border-[var(--rw-ink)] shadow-sm'
                        : 'border-[var(--rw-line)] bg-[var(--rw-surface)] text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]'
                    }`}
                  >
                    <span>Employer Sign In</span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        hoveredAction === 'recruiter' ? 'translate-x-0.5 text-white' : 'text-[var(--rw-muted)]'
                      }`}
                    />
                  </a>
                </>
              )}

              <button
                type="button"
                onMouseEnter={() => setHoveredAction('enquire')}
                onClick={() => {
                  setMobileOpen(false);
                  setEnquiryOpen(true);
                }}
                className={`mt-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                  hoveredAction === null || hoveredAction === 'enquire'
                    ? 'bg-[var(--rw-ink)] text-white border-[var(--rw-ink)] shadow-sm'
                    : 'border-[var(--rw-line)] bg-[var(--rw-surface)] text-[var(--rw-muted)] hover:bg-[var(--rw-paper-deep)]'
                }`}
              >
                <span>Enquire Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
