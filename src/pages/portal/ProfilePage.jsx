import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Circle, Plus } from 'lucide-react';
import ActionPair from '../../components/ActionPair.jsx';
import { API_URL, api, authToken } from '../../lib/api.js';
import EditableFactList, { FactVaultPanel } from './profile/EditableFactList.jsx';

const SECTIONS = [
  { id: 'personal', num: '01', label: 'Personal Information' },
  { id: 'summary', num: '02', label: 'Professional Summary' },
  { id: 'experience', num: '03', label: 'Work Experience' },
  { id: 'education', num: '04', label: 'Education' },
  { id: 'skills', num: '05', label: 'Skills & Competencies' },
  { id: 'projects', num: '06', label: 'Projects & Portfolio' },
  { id: 'certifications', num: '07', label: 'Certifications & Training' },
  { id: 'languages', num: '08', label: 'Languages' },
  { id: 'preferences', num: '09', label: 'Career Preferences' },
  { id: 'authorization', num: '10', label: 'Work Authorization' },
];

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'];
const SKILL_CATS = [
  'PROGRAMMING',
  'FRAMEWORKS',
  'DATABASES',
  'CLOUD',
  'AI_ML',
  'TOOLS',
  'SOFT',
  'INDUSTRY',
  'TECHNICAL',
];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SectionActions({ saving, dirty, onCancel }) {
  return <ActionPair saving={saving} dirty={dirty} onCancel={onCancel} />;
}

function inputClass() {
  return 'w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400';
}

function csv(arr) {
  return Array.isArray(arr) ? arr.join(', ') : '';
}
function fromCsv(s) {
  return String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [section, setSection] = useState('personal');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api('/candidates/profile');
    setProfile(data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const completion = profile?.profileCompletion || { percent: 0, sections: [] };
  const statusMap = useMemo(() => {
    const m = {};
    for (const s of completion.sections || []) m[s.id] = s.complete;
    return m;
  }, [completion]);

  async function patchProfile(body) {
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const data = await api('/candidates/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setProfile(data);
      setSaved('Saved');
      setTimeout(() => setSaved(''), 2500);
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function addItem(collection, body) {
    setSaving(true);
    setError('');
    try {
      const data = await api(`/candidates/profile/${collection}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setProfile(data);
      setSaved('Added');
      setTimeout(() => setSaved(''), 2000);
    } catch (e) {
      setError(e.message || 'Add failed');
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(collection, id) {
    setSaving(true);
    try {
      const data = await api(`/candidates/profile/${collection}/${id}`, { method: 'DELETE' });
      setProfile(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(collection, id, body) {
    setSaving(true);
    setError('');
    try {
      const data = await api(`/candidates/profile/${collection}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setProfile(data);
      setSaved('Updated');
      setTimeout(() => setSaved(''), 2000);
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function verifyItem(collection, id, isVerified = true) {
    setSaving(true);
    try {
      const data = await api(`/candidates/profile/${collection}/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ isVerified }),
      });
      setProfile(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file) {
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/candidates/profile/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken()}` },
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Photo upload failed');
      setProfile(data);
      setSaved('Photo saved');
      setTimeout(() => setSaved(''), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return <div className="text-sm text-zinc-500">{error || 'Loading master profile…'}</div>;
  }

  const pi = profile.personalInformation || {};
  const ps = profile.professionalSummary || {};
  const pref = profile.careerPreferences || {};
  const wa = profile.workAuthorization || {};
  const user = profile.user || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Master Profile · Career Fact Vault
          </div>
          <h1 className="mt-1 text-xl font-semibold text-zinc-950">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Candidate'}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            {profile.careerStage || 'Set career stage'} · Enter once → generate resumes → reuse for applications
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums text-zinc-900">{completion.percent}%</div>
          <div className="text-[11px] text-zinc-500">
            {completion.done}/{completion.total} sections
          </div>
          <Link to="/portal/resumes" className="mt-2 inline-block text-xs font-semibold text-zinc-700 underline">
            Generate resumes →
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}
      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {saved}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        {/* Left section nav */}
        <aside className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm h-fit sticky top-4">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Sections
          </div>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => {
              const done = statusMap[s.id];
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition ${
                    active ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <span className={`tabular-nums ${active ? 'text-zinc-400' : 'text-zinc-400'}`}>{s.num}</span>
                  <span className="flex-1 font-medium leading-snug">{s.label}</span>
                  {done ? (
                    <Check className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-emerald-300' : 'text-emerald-600'}`} />
                  ) : (
                    <Circle className={`h-3 w-3 shrink-0 ${active ? 'text-zinc-500' : 'text-zinc-300'}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Center editor */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm min-h-[420px]">
          {section === 'personal' && (
            <PersonalSection
              profile={profile}
              user={user}
              pi={pi}
              saving={saving}
              onSave={(body) => patchProfile(body)}
              onPhoto={uploadPhoto}
              inputClass={inputClass}
              Field={Field}
            />
          )}
          {section === 'summary' && (
            <SummarySection ps={ps} saving={saving} onSave={(body) => patchProfile(body)} Field={Field} inputClass={inputClass} />
          )}
          {section === 'experience' && (
            <EditableFactList
              title="03 · Work Experience"
              items={profile.experiences || []}
              empty="No employment records yet. Add unlimited roles."
              saving={saving}
              fields={[
                { key: 'companyName', label: 'Company' },
                { key: 'jobTitle', label: 'Job title' },
                { key: 'country', label: 'Country' },
                { key: 'city', label: 'City' },
                { key: 'description', label: 'Responsibilities', type: 'textarea' },
                { key: 'technologies', label: 'Technologies (comma)', asCsv: true },
                { key: 'isCurrent', label: 'Currently working', type: 'checkbox' },
              ]}
              renderSummary={(e) => (
                <div>
                  <div className="font-semibold text-zinc-900">
                    {e.jobTitle} · {e.companyName}
                    {e.isVerified ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-700">Verified</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {[e.city, e.country].filter(Boolean).join(', ')} · {e.isCurrent ? 'Present' : 'Past'}
                  </div>
                </div>
              )}
              onSaveItem={(id, body) => updateItem('experiences', id, body)}
              onRemove={(id) => removeItem('experiences', id)}
              onVerify={(id, v) => verifyItem('experiences', id, v)}
              extra={
                <ExperienceQuickAdd
                  onAdd={(body) => addItem('experiences', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'education' && (
            <EditableFactList
              title="04 · Education"
              items={profile.educations || []}
              empty="Add degrees and institutions."
              saving={saving}
              fields={[
                { key: 'institution', label: 'Institution' },
                { key: 'degree', label: 'Degree' },
                { key: 'fieldOfStudy', label: 'Field of study' },
                { key: 'country', label: 'Country' },
                { key: 'graduationYear', label: 'Graduation year', type: 'number' },
                { key: 'grade', label: 'Grade / CGPA' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
              renderSummary={(e) => (
                <div>
                  <div className="font-semibold text-zinc-900">
                    {e.degree} — {e.fieldOfStudy}
                    {e.isVerified ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-700">Verified</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {e.institution}
                    {e.graduationYear ? ` · ${e.graduationYear}` : ''}
                  </div>
                </div>
              )}
              onSaveItem={(id, body) => updateItem('educations', id, body)}
              onRemove={(id) => removeItem('educations', id)}
              onVerify={(id, v) => verifyItem('educations', id, v)}
              extra={
                <EducationQuickAdd
                  onAdd={(body) => addItem('educations', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'skills' && (
            <EditableFactList
              title="05 · Skills & Competencies"
              items={profile.skills || []}
              empty="Add skills by category with proficiency."
              saving={saving}
              fields={[
                { key: 'skillName', label: 'Skill' },
                { key: 'category', label: 'Category' },
                { key: 'proficiency', label: 'Proficiency' },
                { key: 'yearsExperience', label: 'Years', type: 'number' },
              ]}
              renderSummary={(s) => (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-zinc-900">{s.skillName}</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                    {s.category}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {s.proficiency || '—'} · {s.yearsExperience || 0}y
                    {s.isVerified ? ' · Verified' : ''}
                  </span>
                </div>
              )}
              onSaveItem={(id, body) => updateItem('skills', id, body)}
              onRemove={(id) => removeItem('skills', id)}
              onVerify={(id, v) => verifyItem('skills', id, v)}
              extra={
                <SkillQuickAdd
                  onAdd={(body) => addItem('skills', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'projects' && (
            <EditableFactList
              title="06 · Projects & Portfolio"
              items={profile.projects || []}
              empty="Showcase projects, GitHub, measurable outcomes."
              saving={saving}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'role', label: 'Role' },
                { key: 'technologies', label: 'Technologies (comma)', asCsv: true },
                { key: 'githubUrl', label: 'GitHub' },
                { key: 'projectUrl', label: 'URL' },
              ]}
              renderSummary={(p) => (
                <div>
                  <div className="font-semibold text-zinc-900">
                    {p.name}
                    {p.isVerified ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-700">Verified</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500 line-clamp-2">{p.description}</div>
                </div>
              )}
              onSaveItem={(id, body) => updateItem('projects', id, body)}
              onRemove={(id) => removeItem('projects', id)}
              onVerify={(id, v) => verifyItem('projects', id, v)}
              extra={
                <ProjectQuickAdd
                  onAdd={(body) => addItem('projects', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'certifications' && (
            <EditableFactList
              title="07 · Certifications & Training"
              items={profile.certifications || []}
              empty="Add professional credentials."
              saving={saving}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'issuer', label: 'Issuer' },
                { key: 'credentialId', label: 'Credential ID' },
                { key: 'verificationUrl', label: 'Verification URL' },
              ]}
              renderSummary={(c) => (
                <div>
                  <div className="font-semibold text-zinc-900">
                    {c.name}
                    {c.isVerified ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-700">Verified</span>
                    ) : null}
                  </div>
                  <div className="text-xs text-zinc-500">{c.issuer}</div>
                </div>
              )}
              onSaveItem={(id, body) => updateItem('certifications', id, body)}
              onRemove={(id) => removeItem('certifications', id)}
              onVerify={(id, v) => verifyItem('certifications', id, v)}
              extra={
                <CertQuickAdd
                  onAdd={(body) => addItem('certifications', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'languages' && (
            <EditableFactList
              title="08 · Languages (CEFR)"
              items={profile.languages || []}
              empty="Add languages with A1–C2 / Native."
              saving={saving}
              fields={[
                { key: 'languageCode', label: 'Language' },
                { key: 'proficiencyLevel', label: 'CEFR' },
              ]}
              renderSummary={(l) => (
                <div className="font-semibold text-zinc-900">
                  {l.languageCode} · {l.proficiencyLevel}
                  {l.isVerified ? (
                    <span className="ml-2 text-[10px] font-semibold uppercase text-emerald-700">Verified</span>
                  ) : null}
                </div>
              )}
              onSaveItem={(id, body) => updateItem('languages', id, body)}
              onRemove={(id) => removeItem('languages', id)}
              onVerify={(id, v) => verifyItem('languages', id, v)}
              extra={
                <LangQuickAdd
                  onAdd={(body) => addItem('languages', body)}
                  Field={Field}
                  inputClass={inputClass}
                  saving={saving}
                />
              }
            />
          )}
          {section === 'preferences' && (
            <PreferencesSection
              pref={pref}
              profile={profile}
              Field={Field}
              inputClass={inputClass}
              saving={saving}
              onSave={(body) => patchProfile(body)}
              csv={csv}
              fromCsv={fromCsv}
            />
          )}
          {section === 'authorization' && (
            <AuthSection
              wa={wa}
              profile={profile}
              Field={Field}
              inputClass={inputClass}
              saving={saving}
              onSave={(body) => patchProfile(body)}
              csv={csv}
              fromCsv={fromCsv}
            />
          )}
        </section>

        {/* Right rail */}
        <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm h-fit sticky top-4 space-y-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Completion</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-zinc-900" style={{ width: `${completion.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Mandatory for account: career stage, mobile, email. Rest progressive.
            </p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Missing</div>
            <ul className="mt-2 space-y-1.5">
              {SECTIONS.filter((s) => !statusMap[s.id]).slice(0, 5).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSection(s.id)}
                    className="text-left text-xs font-medium text-amber-800 hover:underline"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              {SECTIONS.every((s) => statusMap[s.id]) ? (
                <li className="text-xs text-emerald-700">All sections complete.</li>
              ) : null}
            </ul>
          </div>
          <FactVaultPanel
            profile={profile}
            onVerify={(collection, id, v) => verifyItem(collection, id, v)}
            onJump={(sec) => setSection(sec)}
          />
          <Link
            to="/portal/documents"
            className="block rounded-full border border-zinc-200 py-2 text-center text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            My Documents
          </Link>
        </aside>
      </div>
    </div>
  );
}

function personalSnapshot(profile, user, pi) {
  return {
    careerStage: profile.careerStage || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    middleName: pi.middleName || '',
    phone: profile.phone || '',
    nationality: profile.nationality || '',
    currentResidenceCountry: profile.currentResidenceCountry || '',
    currentCity: pi.currentCity || '',
    currentAddress: pi.currentAddress || '',
    linkedinUrl: pi.linkedinUrl || '',
    githubUrl: pi.githubUrl || '',
    portfolioUrl: pi.portfolioUrl || '',
    gender: pi.gender || '',
  };
}

function PersonalSection({ profile, user, pi, onSave, onPhoto, saving, Field, inputClass }) {
  const serverForm = useMemo(() => personalSnapshot(profile, user, pi), [profile, user, pi]);
  const [form, setForm] = useState(serverForm);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serverPhotoUrl, setServerPhotoUrl] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setForm(serverForm);
    setPendingPhoto(null);
    if (fileRef.current) fileRef.current.value = '';
  }, [serverForm]);

  const dirty = Boolean(pendingPhoto) || JSON.stringify(form) !== JSON.stringify(serverForm);

  useEffect(() => {
    let revoked = false;
    let objectUrl = null;
    if (!pi.photoKey) {
      setServerPhotoUrl(null);
      return undefined;
    }
    fetch(`${API_URL}/candidates/profile/photo?v=${encodeURIComponent(pi.photoKey)}`, {
      headers: { Authorization: `Bearer ${authToken()}` },
      credentials: 'include',
    })
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob || revoked) return;
        objectUrl = URL.createObjectURL(blob);
        setServerPhotoUrl(objectUrl);
      })
      .catch(() => setServerPhotoUrl(null));
    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pi.photoKey]);

  useEffect(() => {
    if (!pendingPhoto) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(pendingPhoto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingPhoto]);

  function cancelEdits() {
    setForm(serverForm);
    setPendingPhoto(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function submitPersonal(e) {
    e.preventDefault();
    if (pendingPhoto) {
      await onPhoto(pendingPhoto);
      setPendingPhoto(null);
      if (fileRef.current) fileRef.current.value = '';
    }
    await onSave({
      careerStage: form.careerStage || undefined,
      phone: form.phone,
      nationality: form.nationality,
      currentResidenceCountry: form.currentResidenceCountry,
      user: { firstName: form.firstName, lastName: form.lastName },
      personalInformation: {
        middleName: form.middleName,
        currentCity: form.currentCity,
        currentAddress: form.currentAddress,
        linkedinUrl: form.linkedinUrl,
        githubUrl: form.githubUrl,
        portfolioUrl: form.portfolioUrl,
        gender: form.gender,
      },
    });
  }

  const shownPhoto = previewUrl || serverPhotoUrl;

  return (
    <form className="space-y-4" onSubmit={submitPersonal}>
      <h2 className="text-lg font-semibold text-zinc-950">01 · Personal Information</h2>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
          {shownPhoto ? (
            <img src={shownPhoto} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <label className="text-xs font-semibold text-zinc-700">
          Profile photo
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-1 block w-full text-xs"
            onChange={(e) => setPendingPhoto(e.target.files?.[0] || null)}
          />
          {pendingPhoto ? (
            <span className="mt-1 block text-[11px] font-medium text-amber-700">
              New photo pending — Cancel or Save changes
            </span>
          ) : null}
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {['FRESHER', 'EXPERIENCED'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setForm((f) => ({ ...f, careerStage: s }))}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
              form.careerStage === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200'
            }`}
          >
            {s === 'FRESHER' ? 'Fresher' : 'Experienced'}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="First name *">
          <input className={inputClass()} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        </Field>
        <Field label="Middle name">
          <input className={inputClass()} value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
        </Field>
        <Field label="Last name *">
          <input className={inputClass()} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        </Field>
      </div>
      <Field label="Email (account)">
        <input className={inputClass() + ' bg-zinc-50'} value={user.email || ''} readOnly />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Mobile *">
          <input className={inputClass()} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </Field>
        <Field label="Gender (optional)">
          <input className={inputClass()} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
        </Field>
        <Field label="Nationality">
          <input className={inputClass()} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
        </Field>
        <Field label="Current country">
          <input className={inputClass()} value={form.currentResidenceCountry} onChange={(e) => setForm({ ...form, currentResidenceCountry: e.target.value })} />
        </Field>
        <Field label="Current city">
          <input className={inputClass()} value={form.currentCity} onChange={(e) => setForm({ ...form, currentCity: e.target.value })} />
        </Field>
        <Field label="Address">
          <input className={inputClass()} value={form.currentAddress} onChange={(e) => setForm({ ...form, currentAddress: e.target.value })} />
        </Field>
        <Field label="LinkedIn URL">
          <input className={inputClass()} value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
        </Field>
        <Field label="GitHub URL">
          <input className={inputClass()} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
        </Field>
        <Field label="Portfolio URL">
          <input className={inputClass()} value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
        </Field>
      </div>
      <SectionActions saving={saving} dirty={dirty} onCancel={cancelEdits} />
    </form>
  );
}

function summarySnapshot(ps) {
  return {
    headline: ps.headline || '',
    about: ps.about || '',
    yearsExperience: ps.yearsExperience ?? '',
    careerLevel: ps.careerLevel || '',
    currentJobTitle: ps.currentJobTitle || '',
    industry: ps.industry || '',
    primarySpecialization: ps.primarySpecialization || '',
    careerObjective: ps.careerObjective || '',
  };
}

function SummarySection({ ps, onSave, saving, Field, inputClass }) {
  const serverForm = useMemo(() => summarySnapshot(ps), [ps]);
  const [form, setForm] = useState(serverForm);
  useEffect(() => {
    setForm(serverForm);
  }, [serverForm]);
  const dirty = JSON.stringify(form) !== JSON.stringify(serverForm);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          professionalSummary: {
            ...form,
            yearsExperience: form.yearsExperience === '' ? undefined : Number(form.yearsExperience),
            careerLevel: form.careerLevel || undefined,
          },
        });
      }}
    >
      <h2 className="text-lg font-semibold text-zinc-950">02 · Professional Summary</h2>
      <Field label="Headline">
        <input className={inputClass()} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Junior Software Developer specializing in…" />
      </Field>
      <Field label="About / summary">
        <textarea className={inputClass()} rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Years of experience">
          <input type="number" className={inputClass()} value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} />
        </Field>
        <Field label="Career level">
          <select className={inputClass()} value={form.careerLevel} onChange={(e) => setForm({ ...form, careerLevel: e.target.value })}>
            <option value="">Select</option>
            {['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'].map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Current job title">
          <input className={inputClass()} value={form.currentJobTitle} onChange={(e) => setForm({ ...form, currentJobTitle: e.target.value })} />
        </Field>
        <Field label="Industry">
          <input className={inputClass()} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </Field>
        <Field label="Primary specialization">
          <input className={inputClass()} value={form.primarySpecialization} onChange={(e) => setForm({ ...form, primarySpecialization: e.target.value })} />
        </Field>
      </div>
      <Field label="Career objective">
        <textarea className={inputClass()} rows={3} value={form.careerObjective} onChange={(e) => setForm({ ...form, careerObjective: e.target.value })} />
      </Field>
      <SectionActions saving={saving} dirty={dirty} onCancel={() => setForm(serverForm)} />
    </form>
  );
}

function preferencesSnapshot(pref, profile) {
  return {
    desiredJobTitles: csv(pref.desiredJobTitles),
    preferredIndustries: csv(pref.preferredIndustries),
    targetCountries: csv(pref.targetCountries?.length ? pref.targetCountries : profile.targetCountries),
    preferredCities: csv(pref.preferredCities),
    workMode: pref.workMode || '',
    expectedSalary: pref.expectedSalary ?? profile.desiredSalaryEur ?? '',
    salaryCurrency: pref.salaryCurrency || 'EUR',
    noticePeriod: pref.noticePeriod || '',
    willingToRelocate: pref.willingToRelocate ?? profile.relocationReady ?? false,
  };
}

function PreferencesSection({ pref, profile, onSave, saving, Field, inputClass, csv, fromCsv }) {
  const serverForm = useMemo(() => preferencesSnapshot(pref, profile), [pref, profile]);
  const [form, setForm] = useState(serverForm);
  useEffect(() => {
    setForm(serverForm);
  }, [serverForm]);
  const dirty = JSON.stringify(form) !== JSON.stringify(serverForm);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          careerPreferences: {
            desiredJobTitles: fromCsv(form.desiredJobTitles),
            preferredIndustries: fromCsv(form.preferredIndustries),
            targetCountries: fromCsv(form.targetCountries),
            preferredCities: fromCsv(form.preferredCities),
            workMode: form.workMode || undefined,
            expectedSalary: form.expectedSalary === '' ? undefined : Number(form.expectedSalary),
            salaryCurrency: form.salaryCurrency,
            noticePeriod: form.noticePeriod,
            willingToRelocate: form.willingToRelocate,
          },
          targetCountries: fromCsv(form.targetCountries),
          desiredSalaryEur: form.expectedSalary === '' ? null : Number(form.expectedSalary),
          relocationReady: form.willingToRelocate,
        });
      }}
    >
      <h2 className="text-lg font-semibold text-zinc-950">09 · Career Preferences</h2>
      <Field label="Desired job titles (comma)">
        <input className={inputClass()} value={form.desiredJobTitles} onChange={(e) => setForm({ ...form, desiredJobTitles: e.target.value })} />
      </Field>
      <Field label="Preferred industries (comma)">
        <input className={inputClass()} value={form.preferredIndustries} onChange={(e) => setForm({ ...form, preferredIndustries: e.target.value })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Target countries">
          <input className={inputClass()} value={form.targetCountries} onChange={(e) => setForm({ ...form, targetCountries: e.target.value })} placeholder="DE, NL, IE" />
        </Field>
        <Field label="Preferred cities">
          <input className={inputClass()} value={form.preferredCities} onChange={(e) => setForm({ ...form, preferredCities: e.target.value })} />
        </Field>
        <Field label="Work mode">
          <select className={inputClass()} value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })}>
            <option value="">Select</option>
            {['REMOTE', 'HYBRID', 'ONSITE', 'FLEXIBLE'].map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Expected salary">
          <input type="number" className={inputClass()} value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} />
        </Field>
        <Field label="Currency">
          <input className={inputClass()} value={form.salaryCurrency} onChange={(e) => setForm({ ...form, salaryCurrency: e.target.value })} />
        </Field>
        <Field label="Notice period">
          <input className={inputClass()} value={form.noticePeriod} onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })} />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.willingToRelocate} onChange={(e) => setForm({ ...form, willingToRelocate: e.target.checked })} />
        Willing to relocate
      </label>
      <SectionActions saving={saving} dirty={dirty} onCancel={() => setForm(serverForm)} />
    </form>
  );
}

function authSnapshot(wa, profile) {
  return {
    countryOfResidence: wa.countryOfResidence || profile.currentResidenceCountry || '',
    currentAuthorization: wa.currentAuthorization || '',
    visaType: wa.visaType || profile.visaStatus || '',
    authorizedCountries: csv(wa.authorizedCountries),
    requiresSponsorship: wa.requiresSponsorship ?? profile.sponsorshipRequired ?? true,
    willingToRelocate: wa.willingToRelocate ?? false,
    relocationPreferences: wa.relocationPreferences || '',
  };
}

function AuthSection({ wa, profile, onSave, saving, Field, inputClass, csv, fromCsv }) {
  const serverForm = useMemo(() => authSnapshot(wa, profile), [wa, profile]);
  const [form, setForm] = useState(serverForm);
  useEffect(() => {
    setForm(serverForm);
  }, [serverForm]);
  const dirty = JSON.stringify(form) !== JSON.stringify(serverForm);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          workAuthorization: {
            countryOfResidence: form.countryOfResidence,
            currentAuthorization: form.currentAuthorization,
            visaType: form.visaType,
            authorizedCountries: fromCsv(form.authorizedCountries),
            requiresSponsorship: form.requiresSponsorship,
            willingToRelocate: form.willingToRelocate,
            relocationPreferences: form.relocationPreferences,
          },
          visaStatus: form.visaType,
          sponsorshipRequired: form.requiresSponsorship,
          currentResidenceCountry: form.countryOfResidence,
        });
      }}
    >
      <h2 className="text-lg font-semibold text-zinc-950">10 · Work Authorization</h2>
      <p className="text-xs text-zinc-500">Collect only what recruitment needs. Keep immigration details private.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Country of residence">
          <input className={inputClass()} value={form.countryOfResidence} onChange={(e) => setForm({ ...form, countryOfResidence: e.target.value })} />
        </Field>
        <Field label="Current work authorization">
          <input className={inputClass()} value={form.currentAuthorization} onChange={(e) => setForm({ ...form, currentAuthorization: e.target.value })} />
        </Field>
        <Field label="Visa type">
          <input className={inputClass()} value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })} placeholder="Blue Card, national…" />
        </Field>
        <Field label="Countries authorized to work">
          <input className={inputClass()} value={form.authorizedCountries} onChange={(e) => setForm({ ...form, authorizedCountries: e.target.value })} />
        </Field>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.requiresSponsorship} onChange={(e) => setForm({ ...form, requiresSponsorship: e.target.checked })} />
        Requires sponsorship
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.willingToRelocate} onChange={(e) => setForm({ ...form, willingToRelocate: e.target.checked })} />
        Willing to relocate
      </label>
      <Field label="Relocation preferences">
        <textarea className={inputClass()} rows={2} value={form.relocationPreferences} onChange={(e) => setForm({ ...form, relocationPreferences: e.target.value })} />
      </Field>
      <SectionActions saving={saving} dirty={dirty} onCancel={() => setForm(serverForm)} />
    </form>
  );
}

function ExperienceQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({
    companyName: '',
    jobTitle: '',
    country: '',
    city: '',
    isCurrent: true,
    description: '',
    technologies: '',
  });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({
          companyName: f.companyName,
          jobTitle: f.jobTitle,
          country: f.country,
          city: f.city,
          isCurrent: f.isCurrent,
          startDate: new Date().toISOString(),
          description: f.description,
          technologies: fromCsv(f.technologies),
          bulletPoints: [],
        });
        setF({ companyName: '', jobTitle: '', country: '', city: '', isCurrent: true, description: '', technologies: '' });
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
        <Plus className="h-3.5 w-3.5" /> Add experience
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Company"><input required className={inputClass()} value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} /></Field>
        <Field label="Job title"><input required className={inputClass()} value={f.jobTitle} onChange={(e) => setF({ ...f, jobTitle: e.target.value })} /></Field>
        <Field label="Country"><input className={inputClass()} value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></Field>
        <Field label="City"><input className={inputClass()} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
      </div>
      <Field label="Responsibilities"><textarea className={inputClass()} rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <Field label="Technologies (comma)"><input className={inputClass()} value={f.technologies} onChange={(e) => setF({ ...f, technologies: e.target.value })} /></Field>
      <label className="inline-flex items-center gap-2 text-xs">
        <input type="checkbox" checked={f.isCurrent} onChange={(e) => setF({ ...f, isCurrent: e.target.checked })} /> Currently working
      </label>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}

function EducationQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({ institution: '', degree: '', fieldOfStudy: '', country: '', graduationYear: '' });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({
          ...f,
          graduationYear: f.graduationYear === '' ? undefined : Number(f.graduationYear),
        });
        setF({ institution: '', degree: '', fieldOfStudy: '', country: '', graduationYear: '' });
      }}
    >
      <div className="text-xs font-semibold text-zinc-700">Add education</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Institution"><input required className={inputClass()} value={f.institution} onChange={(e) => setF({ ...f, institution: e.target.value })} /></Field>
        <Field label="Degree"><input required className={inputClass()} value={f.degree} onChange={(e) => setF({ ...f, degree: e.target.value })} /></Field>
        <Field label="Field of study"><input required className={inputClass()} value={f.fieldOfStudy} onChange={(e) => setF({ ...f, fieldOfStudy: e.target.value })} /></Field>
        <Field label="Country"><input className={inputClass()} value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></Field>
        <Field label="Graduation year"><input type="number" className={inputClass()} value={f.graduationYear} onChange={(e) => setF({ ...f, graduationYear: e.target.value })} /></Field>
      </div>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}

function SkillQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({ skillName: '', category: 'PROGRAMMING', proficiency: 'INTERMEDIATE', yearsExperience: 1 });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ ...f, yearsExperience: Number(f.yearsExperience) || 1 });
        setF({ skillName: '', category: 'PROGRAMMING', proficiency: 'INTERMEDIATE', yearsExperience: 1 });
      }}
    >
      <div className="text-xs font-semibold text-zinc-700">Add skill</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Skill"><input required className={inputClass()} value={f.skillName} onChange={(e) => setF({ ...f, skillName: e.target.value })} /></Field>
        <Field label="Category">
          <select className={inputClass()} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {SKILL_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Proficiency">
          <select className={inputClass()} value={f.proficiency} onChange={(e) => setF({ ...f, proficiency: e.target.value })}>
            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Years"><input type="number" className={inputClass()} value={f.yearsExperience} onChange={(e) => setF({ ...f, yearsExperience: e.target.value })} /></Field>
      </div>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}

function ProjectQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({ name: '', description: '', role: '', technologies: '', githubUrl: '', projectUrl: '' });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ ...f, technologies: fromCsv(f.technologies), contributions: [], achievements: [] });
        setF({ name: '', description: '', role: '', technologies: '', githubUrl: '', projectUrl: '' });
      }}
    >
      <div className="text-xs font-semibold text-zinc-700">Add project</div>
      <Field label="Name"><input required className={inputClass()} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Description"><textarea className={inputClass()} rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Role"><input className={inputClass()} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></Field>
        <Field label="Technologies"><input className={inputClass()} value={f.technologies} onChange={(e) => setF({ ...f, technologies: e.target.value })} /></Field>
        <Field label="GitHub"><input className={inputClass()} value={f.githubUrl} onChange={(e) => setF({ ...f, githubUrl: e.target.value })} /></Field>
        <Field label="URL"><input className={inputClass()} value={f.projectUrl} onChange={(e) => setF({ ...f, projectUrl: e.target.value })} /></Field>
      </div>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}

function CertQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({ name: '', issuer: '', credentialId: '', verificationUrl: '' });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(f);
        setF({ name: '', issuer: '', credentialId: '', verificationUrl: '' });
      }}
    >
      <div className="text-xs font-semibold text-zinc-700">Add certification</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Name"><input required className={inputClass()} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Issuer"><input className={inputClass()} value={f.issuer} onChange={(e) => setF({ ...f, issuer: e.target.value })} /></Field>
        <Field label="Credential ID"><input className={inputClass()} value={f.credentialId} onChange={(e) => setF({ ...f, credentialId: e.target.value })} /></Field>
        <Field label="Verification URL"><input className={inputClass()} value={f.verificationUrl} onChange={(e) => setF({ ...f, verificationUrl: e.target.value })} /></Field>
      </div>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}

function LangQuickAdd({ onAdd, Field, inputClass, saving }) {
  const [f, setF] = useState({ languageCode: 'English', proficiencyLevel: 'B2' });
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-200 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(f);
        setF({ languageCode: '', proficiencyLevel: 'B2' });
      }}
    >
      <div className="text-xs font-semibold text-zinc-700">Add language</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Language"><input required className={inputClass()} value={f.languageCode} onChange={(e) => setF({ ...f, languageCode: e.target.value })} /></Field>
        <Field label="CEFR">
          <select className={inputClass()} value={f.proficiencyLevel} onChange={(e) => setF({ ...f, proficiencyLevel: e.target.value })}>
            {CEFR.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <button type="submit" disabled={saving} className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white">Add</button>
    </form>
  );
}
