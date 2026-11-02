import { useEffect, useState } from 'react';
import ActionPair from '../../components/ActionPair.jsx';
import { API_URL, api, authToken } from '../../lib/api.js';

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function RecruiterProfilePage() {
  const [bundle, setBundle] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  async function load() {
    const data = await api('/recruiter/profile');
    setBundle(data);
    setForm({
      firstName: data.user?.firstName || '',
      lastName: data.user?.lastName || '',
      jobTitle: data.profile?.jobTitle || '',
      phone: data.profile?.phone || '',
      department: data.profile?.department || 'HR / Recruitment',
      linkedIn: data.profile?.linkedIn || '',
      legalName: data.company?.legalName || data.user?.companyName || '',
      registrationNumber: data.company?.registrationNumber || '',
      registrationCountry: data.company?.registrationCountry || '',
      vatNumber: data.company?.vatNumber || '',
      officeAddress: data.company?.officeAddress || '',
      website: data.company?.website || '',
      industry: data.company?.industry || '',
      companySize: data.company?.companySize || '11-50',
    });
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let revoked = false;
    let url;
    if (!bundle?.profile?.hasPhoto) {
      setPhotoUrl(null);
      return undefined;
    }
    fetch(`${API_URL}/recruiter/profile/photo`, {
      headers: { Authorization: `Bearer ${authToken()}` },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob || revoked) return;
        url = URL.createObjectURL(blob);
        setPhotoUrl(url);
      })
      .catch(() => {});
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [bundle?.profile?.hasPhoto, bundle?.profile?.photoKey]);

  useEffect(() => {
    let revoked = false;
    let url;
    if (!bundle?.company?.hasLogo) {
      setLogoUrl(null);
      return undefined;
    }
    fetch(`${API_URL}/recruiter/company/logo`, {
      headers: { Authorization: `Bearer ${authToken()}` },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob || revoked) return;
        url = URL.createObjectURL(blob);
        setLogoUrl(url);
      })
      .catch(() => {});
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [bundle?.company?.hasLogo, bundle?.company?.logoKey]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const data = await api('/recruiter/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setBundle(data);
      setSaved('Profile saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function upload(kind, file) {
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const path = kind === 'photo' ? '/recruiter/profile/photo' : '/recruiter/company/logo';
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken()}` },
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setBundle(data);
      setSaved(kind === 'photo' ? 'Photo saved' : 'Logo saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <p className="text-sm text-zinc-500">{error || 'Loading recruiter profile…'}</p>;
  }

  const input =
    'mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Recruiter profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill person + company details after signup. Required before strong hiring trust.
        </p>
        {!bundle?.onboardingComplete ? (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Incomplete: need name, job title, phone, company legal name, and registration country.
          </p>
        ) : (
          <p className="mt-2 text-xs font-semibold text-emerald-700">Onboarding complete</p>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}

      <form onSubmit={save} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-900">Person</h2>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
              {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <label className="text-xs font-semibold text-zinc-700">
              Profile photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1 block w-full text-xs"
                onChange={(e) => upload('photo', e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-zinc-600">
              First name *
              <input
                className={input}
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Last name *
              <input
                className={input}
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Job title *
              <input
                className={input}
                required
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Phone *
              <input
                className={input}
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Department
              <input
                className={input}
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              LinkedIn
              <input
                className={input}
                value={form.linkedIn}
                onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="space-y-3 border-t border-zinc-100 pt-4">
          <h2 className="text-sm font-bold text-zinc-900">Company</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-contain" /> : null}
            </div>
            <label className="text-xs font-semibold text-zinc-700">
              Company logo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1 block w-full text-xs"
                onChange={(e) => upload('logo', e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-zinc-600 sm:col-span-2">
              Legal name *
              <input
                className={input}
                required
                value={form.legalName}
                onChange={(e) => setForm({ ...form, legalName: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Registration country * (e.g. DE)
              <input
                className={input}
                required
                value={form.registrationCountry}
                onChange={(e) => setForm({ ...form, registrationCountry: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Registration number
              <input
                className={input}
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              VAT
              <input
                className={input}
                value={form.vatNumber}
                onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Industry
              <input
                className={input}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600">
              Company size
              <select
                className={input}
                value={form.companySize}
                onChange={(e) => setForm({ ...form, companySize: e.target.value })}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-zinc-600 sm:col-span-2">
              Office address
              <input
                className={input}
                value={form.officeAddress}
                onChange={(e) => setForm({ ...form, officeAddress: e.target.value })}
              />
            </label>
            <label className="text-xs font-medium text-zinc-600 sm:col-span-2">
              Website
              <input
                className={input}
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
          </div>
          {bundle?.company?.verificationStatus ? (
            <p className="text-xs text-zinc-500">
              Verification: <strong>{bundle.company.verificationStatus}</strong>
            </p>
          ) : null}
        </section>

        <ActionPair
          saving={saving}
          dirty
          onCancel={() => load().catch((e) => setError(e.message))}
        />
      </form>
    </div>
  );
}
