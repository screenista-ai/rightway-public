import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const emptyForm = {
  careerStage: '',
  phone: '',
  nationality: '',
  currentResidenceCountry: '',
  targetCountries: '',
  relocationReady: false,
  desiredSalaryEur: '',
  visaStatus: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function load() {
    const data = await api('/candidates/profile');
    setProfile(data);
    setForm({
      careerStage: data.careerStage || '',
      phone: data.phone || '',
      nationality: data.nationality || '',
      currentResidenceCountry: data.currentResidenceCountry || '',
      targetCountries: (data.targetCountries || []).join(', '),
      relocationReady: Boolean(data.relocationReady),
      desiredSalaryEur: data.desiredSalaryEur ?? '',
      visaStatus: data.visaStatus || '',
    });
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      if (!form.careerStage) throw new Error('Select fresher or experienced');
      if (!String(form.phone).trim() || String(form.phone).trim().length < 8) {
        throw new Error('Mobile number is required (min 8 digits)');
      }
      const data = await api('/candidates/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          careerStage: form.careerStage,
          phone: form.phone,
          nationality: form.nationality || undefined,
          currentResidenceCountry: form.currentResidenceCountry || undefined,
          targetCountries: form.targetCountries,
          relocationReady: form.relocationReady,
          desiredSalaryEur: form.desiredSalaryEur === '' ? null : Number(form.desiredSalaryEur),
          visaStatus: form.visaStatus || undefined,
        }),
      });
      setProfile(data);
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const email = profile?.user?.email || '';
  const complete = profile?.profileBasicsComplete;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Profile</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Fresher/experienced, mobile, and email are required. Fill the rest as you go — used by resume
          templates and ATS checks.
        </p>
      </div>

      {!complete && profile ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Complete mandatory fields (career stage + mobile). Email comes from your login account.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile saved.
        </div>
      ) : null}

      <form onSubmit={save} className="space-y-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Mandatory</h2>

          <div>
            <div className="text-xs font-medium text-zinc-700 mb-2">Career stage</div>
            <div className="flex flex-wrap gap-2">
              {['FRESHER', 'EXPERIENCED'].map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setField('careerStage', stage)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold border transition ${
                    form.careerStage === stage
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {stage === 'FRESHER' ? 'Fresher' : 'Experienced'}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Mobile</span>
            <input
              required
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="+49 …"
              className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-zinc-700">Email</span>
            <input
              value={email}
              readOnly
              className="mt-1.5 w-full rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-600"
            />
            <span className="mt-1 block text-[11px] text-zinc-400">From your account — change in Settings if needed.</span>
          </label>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Optional — fill as you go
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Nationality</span>
              <input
                value={form.nationality}
                onChange={(e) => setField('nationality', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Current residence country</span>
              <input
                value={form.currentResidenceCountry}
                onChange={(e) => setField('currentResidenceCountry', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-zinc-700">Target countries (comma-separated)</span>
              <input
                value={form.targetCountries}
                onChange={(e) => setField('targetCountries', e.target.value)}
                placeholder="DE, NL, IE"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Desired salary (EUR)</span>
              <input
                type="number"
                value={form.desiredSalaryEur}
                onChange={(e) => setField('desiredSalaryEur', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Visa status</span>
              <input
                value={form.visaStatus}
                onChange={(e) => setField('visaStatus', e.target.value)}
                placeholder="Blue Card, sponsorship…"
                className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.relocationReady}
              onChange={(e) => setField('relocationReady', e.target.checked)}
              className="rounded border-zinc-300"
            />
            Ready to relocate
          </label>

          {form.careerStage === 'EXPERIENCED' ? (
            <p className="text-xs text-zinc-500">
              Tip: add work history under Documents / Fact verification when ready. Templates pull verified
              experience into previews.
            </p>
          ) : form.careerStage === 'FRESHER' ? (
            <p className="text-xs text-zinc-500">
              Fresher mode: experience optional. Education and skills still improve ATS + templates.
            </p>
          ) : null}
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
