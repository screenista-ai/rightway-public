import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, User, Briefcase, Building, Mail, ArrowRight } from 'lucide-react';
import { API_URL, toUserFriendlyMessage } from '../lib/api';
import PhoneCountryInput from './PhoneCountryInput';

const fieldCls =
  'w-full rounded-xl border border-[var(--rw-line)] bg-[var(--rw-paper)] px-3.5 py-2.5 text-sm text-[var(--rw-ink)] placeholder:text-[var(--rw-muted)] focus:border-[var(--rw-ink)] focus:outline-none transition';

export default function EnquiryModal({ isOpen, onClose, initialRole = 'CANDIDATE' }) {
  const [role, setRole] = useState(initialRole);
  const [roleHover, setRoleHover] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const visualRole = roleHover ?? role;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, loading, onClose]);

  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setRoleHover(null);
      setError('');
      setSubmittedId(null);
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  function resetForm() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setMessage('');
    setError('');
    setSubmittedId(null);
    setRoleHover(null);
  }

  function handleModalClose() {
    if (loading) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Valid email required.');
      return;
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.trim() || digitsOnly.length < 7) {
      setError('Phone with country code required (e.g. +49 170 1234567).');
      return;
    }
    if (role === 'RECRUITER' && (!companyName.trim() || companyName.trim().length < 2)) {
      setError('Company name required for recruiters.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setError('Message needs at least 5 characters.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: role === 'RECRUITER' ? companyName.trim() : undefined,
        message: message.trim(),
      };

      const response = await fetch(`${API_URL}/public/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429 && data.message) {
          throw new Error(data.message);
        }
        throw new Error(data.message || toUserFriendlyMessage(data, response.status));
      }

      setSubmittedId(data.enquiryId || 'ENQ-RECORDED');
    } catch (err) {
      setError(err.message || 'Send failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function roleBtn(which) {
    const active = visualRole === which;
    return `flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-xs font-semibold transition duration-200 cursor-pointer ${
      active
        ? 'border-transparent bg-[var(--rw-ink)] text-[var(--rw-paper)] shadow-sm [&_svg]:text-[var(--rw-paper)]'
        : 'border-[var(--rw-line)] bg-transparent text-[var(--rw-muted)] [&_svg]:text-[var(--rw-muted)]'
    }`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto scrollbar-thin bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div
        className="relative flex w-full max-w-lg max-h-[min(92dvh,720px)] flex-col rounded-2xl bg-[var(--rw-surface)] border border-[var(--rw-line)] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 border-b border-[var(--rw-line)] bg-[var(--rw-paper-deep)] px-5 pt-5 pb-4 sm:px-7">
          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--rw-muted)] hover:bg-[var(--rw-surface)] hover:text-[var(--rw-ink)] transition cursor-pointer"
          >
            <X className="pointer-events-none h-4 w-4" />
          </button>

          <h2
            id="enquiry-modal-title"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--rw-ink)] pr-8 rw-enq-in"
          >
            {submittedId ? 'Got it.' : 'Send a note'}
          </h2>
          <p className="mt-1 text-sm text-[var(--rw-muted)] rw-enq-in" style={{ animationDelay: '60ms' }}>
            {submittedId ? 'We reply to the email you gave.' : 'Candidate or recruiter — we answer.'}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-5 py-5 sm:px-7 sm:py-6">
          {submittedId ? (
            <div className="py-6 text-center space-y-4 rw-enq-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--rw-accent-soft)] text-[var(--rw-accent)]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-[var(--rw-ink)]">Message in.</h3>
                <p className="text-sm text-[var(--rw-muted)] max-w-sm mx-auto leading-relaxed">
                  Expect a reply soon.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--rw-paper)] border border-[var(--rw-line)] px-4 py-2 text-xs font-mono text-[var(--rw-muted)]">
                <span>Ref</span>
                <span className="font-bold text-[var(--rw-ink)]">{submittedId}</span>
              </div>
            </div>
          ) : (
            <form id="enquiry-form" onSubmit={handleSubmit} className="space-y-3.5">
              <div className="rw-enq-in" style={{ animationDelay: '40ms' }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--rw-ink)] mb-2.5">
                  You are a
                </p>
                <div
                  className="flex gap-2"
                  onMouseLeave={() => setRoleHover(null)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setRole('CANDIDATE');
                      setError('');
                    }}
                    onMouseEnter={() => setRoleHover('CANDIDATE')}
                    onFocus={() => setRoleHover('CANDIDATE')}
                    onBlur={() => setRoleHover(null)}
                    className={roleBtn('CANDIDATE')}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('RECRUITER');
                      setError('');
                    }}
                    onMouseEnter={() => setRoleHover('RECRUITER')}
                    onFocus={() => setRoleHover('RECRUITER')}
                    onBlur={() => setRoleHover(null)}
                    className={roleBtn('RECRUITER')}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Recruiter</span>
                  </button>
                </div>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 rw-enq-in"
                style={{ animationDelay: '90ms' }}
              >
                <div>
                  <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                    First name <span className="text-[var(--rw-accent-3)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                    Last name <span className="text-[var(--rw-accent-3)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={fieldCls}
                  />
                </div>
              </div>

              <div className="rw-enq-in" style={{ animationDelay: '130ms' }}>
                <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                  Email <span className="text-[var(--rw-accent-3)]">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--rw-muted)]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className={`${fieldCls} pl-9`}
                  />
                </div>
              </div>

              <div className="rw-enq-in" style={{ animationDelay: '170ms' }}>
                <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                  Phone <span className="text-[var(--rw-accent-3)]">*</span>
                </label>
                <PhoneCountryInput
                  value={phone}
                  onChange={(val) => setPhone(val)}
                  disabled={loading}
                  required
                />
              </div>

              {role === 'RECRUITER' && (
                <div className="rw-enq-in" style={{ animationDelay: '40ms' }}>
                  <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                    Company <span className="text-[var(--rw-accent-3)]">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--rw-muted)]">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Tech BV"
                      className={`${fieldCls} pl-9`}
                    />
                  </div>
                </div>
              )}

              <div className="rw-enq-in" style={{ animationDelay: '210ms' }}>
                <label className="block text-xs font-medium text-[var(--rw-muted)] mb-1.5">
                  Message <span className="text-[var(--rw-accent-3)]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    role === 'CANDIDATE'
                      ? 'Role, country, or visa question…'
                      : 'Hiring need or sponsorship question…'
                  }
                  className={`${fieldCls} resize-none`}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-[var(--rw-accent-3)]/40 bg-[var(--rw-coral-soft)] p-3 text-xs text-[var(--rw-ink)] rw-enq-in">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="shrink-0 border-t border-[var(--rw-line)] bg-[var(--rw-surface)] px-5 py-4 sm:px-7">
          {submittedId ? (
            <button
              type="button"
              onClick={handleModalClose}
              className="w-full rounded-full bg-[var(--rw-ink)] py-3 text-sm font-semibold text-[var(--rw-paper)] hover:bg-[var(--rw-accent)] transition cursor-pointer"
            >
              Close
            </button>
          ) : (
            <button
              type="submit"
              form="enquiry-form"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--rw-ink)] py-3 text-sm font-semibold text-[var(--rw-paper)] hover:bg-[var(--rw-accent)] transition disabled:opacity-50 cursor-pointer rw-cta-nudge"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
