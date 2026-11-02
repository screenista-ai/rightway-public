import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionPair from '../../components/ActionPair.jsx';
import { api } from '../../lib/api.js';

const EU_COUNTRIES = [
  'DE', 'NL', 'SE', 'DK', 'NO', 'FR', 'IE', 'ES', 'PL', 'CH', 'AT', 'BE', 'FI', 'EE', 'CZ', 'PT', 'IT'
];

export default function RecruiterPostJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    country: 'DE',
    city: '',
    isRemote: false,
    descriptionRaw: '',
    requirementsClean: '',
    salaryMin: '',
    salaryMax: '',
    visaSponsorshipAvailable: true,
    applicationEmail: '',
    applicationAtsUrl: '',
  });

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api('/recruiter/jobs', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.message || 'Failed to post vacancy');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Post European Vacancy</h1>
        <p className="mt-1 text-sm text-zinc-500">
          List a job for European auto-matching. Candidates are scored based on verified skills and visa eligibility.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Job Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
            placeholder="e.g. Senior Backend Engineer (Node/Go)"
            className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Company / Organization *</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={onChange}
              required
              placeholder="e.g. Amsterdam Data Tech BV"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Target European Country *</label>
            <select
              name="country"
              value={form.country}
              onChange={onChange}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            >
              {EU_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">City / Region</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="e.g. Berlin, Amsterdam, Stockholm"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                name="isRemote"
                checked={form.isRemote}
                onChange={onChange}
                className="rounded border-zinc-300 text-blue-600 focus:ring-0"
              />
              Remote Eligible in EU
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                name="visaSponsorshipAvailable"
                checked={form.visaSponsorshipAvailable}
                onChange={onChange}
                className="rounded border-zinc-300 text-blue-600 focus:ring-0"
              />
              EU Blue Card / Visa Sponsorship
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Annual Salary Min (€ EUR)</label>
            <input
              type="number"
              name="salaryMin"
              value={form.salaryMin}
              onChange={onChange}
              placeholder="e.g. 65000"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Annual Salary Max (€ EUR)</label>
            <input
              type="number"
              name="salaryMax"
              value={form.salaryMax}
              onChange={onChange}
              placeholder="e.g. 85000"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Job Description *</label>
          <textarea
            name="descriptionRaw"
            value={form.descriptionRaw}
            onChange={onChange}
            required
            rows={5}
            placeholder="Paste role responsibilities, tech stack, and scope..."
            className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">Clean Requirements (Key ATS Skills / Qualifications)</label>
          <textarea
            name="requirementsClean"
            value={form.requirementsClean}
            onChange={onChange}
            rows={3}
            placeholder="Bullet list of must-have technologies, years of experience, CEFR language requirements..."
            className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Application Direct Email</label>
            <input
              type="email"
              name="applicationEmail"
              value={form.applicationEmail}
              onChange={onChange}
              placeholder="jobs@company.eu"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Application ATS Link (Optional)</label>
            <input
              type="url"
              name="applicationAtsUrl"
              value={form.applicationAtsUrl}
              onChange={onChange}
              placeholder="https://company.greenhouse.io/jobs/123"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-100 pt-4">
          <ActionPair
            saving={loading}
            dirty
            saveLabel="Publish Vacancy"
            onCancel={() => navigate('/recruiter/jobs')}
          />
        </div>
      </form>
    </div>
  );
}

