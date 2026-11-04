import { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, User, Building, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { API_URL, toUserFriendlyMessage } from '../lib/api';

export default function EnquiryModal({ isOpen, onClose }) {
  const [role, setRole] = useState('CANDIDATE'); // 'CANDIDATE' | 'RECRUITER'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  // Close on Escape key
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSubmittedId(null);
    }
  }, [isOpen]);

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
  }

  function handleModalClose() {
    if (loading) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.trim() || digitsOnly.length < 7) {
      setError('Please provide a valid phone number with country code (e.g. +91 9876543210).');
      return;
    }
    if (role === 'RECRUITER' && (!companyName.trim() || companyName.trim().length < 2)) {
      setError('Company Name is required for Recruiter enquiries.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setError('Please include a brief message (at least 5 characters).');
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
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden my-auto transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative border-b border-zinc-100 bg-gradient-to-b from-zinc-50 to-white px-6 pt-6 pb-4 sm:px-8">
          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Close modal"
            className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <h2
            id="enquiry-modal-title"
            className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 pr-8"
          >
            {submittedId ? 'Enquiry Submitted' : "Let's Connect with RightWay AI"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">
            {submittedId
              ? 'Your enquiry has been received.'
              : 'Tell us how we can help you. Our team will get back to you.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submittedId ? (
            /* Success Screen */
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-900">
                  Enquiry Submitted Successfully!
                </h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting RightWay AI. Our team will review your enquiry and get back to you shortly.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-zinc-50 border border-zinc-200 px-4 py-2 text-xs font-mono text-zinc-700">
                <span className="text-zinc-400">Reference ID:</span>
                <span className="font-bold text-zinc-950">{submittedId}</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition active:scale-[0.99] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  I am inquiring as a
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('CANDIDATE');
                      setError('');
                    }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      role === 'CANDIDATE'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Candidate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('RECRUITER');
                      setError('');
                    }}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      role === 'RECRUITER'
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    <span>Recruiter</span>
                  </button>
                </div>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="w-full rounded-xl border border-zinc-200 pl-9 pr-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Phone Number with country code */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Phone Number (with Country Code) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210 or +49 170 1234567"
                    className="w-full rounded-xl border border-zinc-200 pl-9 pr-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Recruiter Only: Company Name */}
              {role === 'RECRUITER' && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech Solutions BV"
                      className="w-full rounded-xl border border-zinc-200 pl-9 pr-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Message textarea */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      role === 'CANDIDATE'
                        ? 'Tell us about your background, EU relocation goals, or questions...'
                        : 'Tell us about your hiring needs, EU sponsorship roles, or questions...'
                    }
                    className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 animate-in fade-in duration-150">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-400 text-center">
                  Your information will be used to respond to your enquiry.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

