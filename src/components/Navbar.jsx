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

export const NAV_ITEMS = [
  { path: '/jobs', label: 'Jobs', badge: 'Live' },
  { path: '/ats-checker', label: 'ATS Checker' },
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
      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-3 sm:px-5">
        <div className="navbar glass-card relative flex items-center justify-between flex-nowrap gap-2 sm:gap-4 rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-sm border border-zinc-200/80 bg-white/90 backdrop-blur">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-medium tracking-tight shrink-0 whitespace-nowrap">
            <Logo className="h-7 w-7 text-sm shrink-0" />
            <span className="font-semibold text-sm sm:text-base text-zinc-950 whitespace-nowrap">RightWay AI</span>
          </Link>

          {/* Desktop Navigation - Strictly One Line & Non-wrapping with Cursor Highlight Tracking */}
          <nav
            className="hidden lg:flex items-center justify-center flex-nowrap whitespace-nowrap text-sm font-medium text-zinc-600 gap-1"
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
                  className={`rounded-full px-3.5 py-1.5 transition-all duration-150 whitespace-nowrap leading-none ${
                    isHighlighted
                      ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-2xs'
                      : 'hover:text-zinc-950 hover:bg-zinc-50'
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
            {candidateUser ? (
              /* Authenticated Candidate Nav Profile Dropdown */
              <div className="relative shrink-0 hidden lg:block" ref={candidateMenuRef}>
                <button
                  type="button"
                  onClick={() => setCandidateMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-3 shadow-sm hover:bg-zinc-50 transition cursor-pointer"
                  aria-expanded={candidateMenuOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white tracking-wide">
                    {candidateUser.initials}
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 truncate max-w-[120px]">
                    {candidateUser.firstName}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                      candidateMenuOpen ? 'rotate-180 text-zinc-800' : ''
                    }`}
                  />
                </button>

                {candidateMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-100 divide-y divide-zinc-100">
                    <div className="px-3 py-2">
                      <p className="font-bold text-zinc-950 truncate">{candidateUser.name}</p>
                      <p className="text-[11px] text-zinc-400">Candidate Portal</p>
                    </div>

                    <div className="py-1">
                      <a
                        href={surfaces.candidateProfile()}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 font-medium transition"
                      >
                        <UserRound className="h-4 w-4 text-zinc-400" />
                        <span>My Profile</span>
                      </a>
                      <a
                        href={surfaces.candidateSettings()}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 font-medium transition"
                      >
                        <Settings className="h-4 w-4 text-zinc-400" />
                        <span>Account Settings</span>
                      </a>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-600 hover:bg-zinc-100 font-medium transition text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-zinc-400" />
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
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-95 shrink-0 whitespace-nowrap leading-none cursor-pointer"
                >
                  <span>Sign In</span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                </button>

                {loginMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setLoginMenuOpen(false)}
                  >
                    <a
                      href={surfaces.candidateLogin()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-100 font-medium"
                    >
                      <User className="h-4 w-4 text-zinc-500 shrink-0" />
                      <div>
                        <div className="font-semibold text-zinc-900 whitespace-nowrap">Candidate Portal</div>
                        <div className="text-[10px] text-zinc-500 whitespace-nowrap">Job Seekers & Applicants</div>
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
            )}

            {/* Primary CTA: Enquire Now (Desktop) */}
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 shrink-0 whitespace-nowrap leading-none cursor-pointer"
            >
              <span className="whitespace-nowrap">Enquire Now</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white p-1.5 text-zinc-700 hover:bg-zinc-50 active:scale-95 transition shrink-0 cursor-pointer"
            >
              {mobileOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur p-4 shadow-xl space-y-3">
            <nav
              className="flex flex-col gap-1 text-sm font-medium text-zinc-700"
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
                        ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
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
              className="pt-2 border-t border-zinc-100 flex flex-col gap-2"
              onMouseLeave={() => setHoveredAction(null)}
            >
              {candidateUser ? (
                /* Authenticated Mobile User Section */
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-2 py-1.5 bg-zinc-50 rounded-xl mb-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">
                      {candidateUser.initials}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-zinc-900 truncate">{candidateUser.name}</div>
                      <div className="text-[10px] text-zinc-400">Candidate Account</div>
                    </div>
                  </div>

                  <a
                    href={surfaces.candidateProfile()}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span>My Profile</span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                  <a
                    href={surfaces.candidateSettings()}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span>Account Settings</span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
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
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-1">
                    Account Access
                  </div>
                  <a
                    href={surfaces.candidateLogin()}
                    onMouseEnter={() => setHoveredAction('candidate')}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 border ${
                      hoveredAction === 'candidate'
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span>Candidate Portal Sign In</span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        hoveredAction === 'candidate' ? 'translate-x-0.5 text-white' : 'text-zinc-400'
                      }`}
                    />
                  </a>
                  <a
                    href={surfaces.recruiterLogin()}
                    onMouseEnter={() => setHoveredAction('recruiter')}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 border ${
                      hoveredAction === 'recruiter'
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span>Employer Sign In</span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        hoveredAction === 'recruiter' ? 'translate-x-0.5 text-white' : 'text-zinc-400'
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
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
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
