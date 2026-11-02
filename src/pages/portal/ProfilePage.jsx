import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const groups = [
  ['experiences', 'experience', 'Work'],
  ['educations', 'education', 'Education'],
  ['skills', 'skill', 'Skills'],
  ['languages', 'language', 'Languages'],
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  async function load() {
    const next = await api('/candidates/profile');
    setProfile(next);
    const doc = next.documents?.[0];
    if (doc) {
      const blob = await api(`/candidates/documents/${doc.id}/file`);
      setPreview(URL.createObjectURL(blob));
    }
  }

  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, []);

  async function verify(type, id) {
    await api(`/candidates/profile/entities/${type}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isVerified: true }),
    });
    await load();
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    const body = {};
    data.forEach((value, key) => {
      body[key] = String(value);
    });
    await api(`/candidates/profile/entities/${editing.type}/${editing.fact.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    setEditing(null);
    await load();
  }

  const facts = profile
    ? [...(profile.experiences || []), ...(profile.educations || []), ...(profile.skills || []), ...(profile.languages || [])]
    : [];
  const verified = facts.filter((fact) => fact.isVerified).length;

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fact verification</h1>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
          Facts verified {verified}/{facts.length}
        </span>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="min-h-96 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Uploaded document</h2>
          {preview ? (
            <iframe title="Document preview" src={preview} className="mt-3 h-[32rem] w-full rounded-xl border" />
          ) : (
            <p className="mt-8 text-sm text-zinc-500">Upload a CV in Documents to preview it here.</p>
          )}
        </section>
        <section className="space-y-4">
          {groups.map(([key, type, label]) => (
            <div key={key} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="font-medium text-zinc-900">{label}</h2>
              <ul className="mt-3 space-y-3">
                {(profile?.[key] ?? []).map((fact) => (
                  <li key={fact.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-zinc-900">
                        {fact.jobTitle || fact.degree || fact.skillName || fact.languageCode}
                      </p>
                      <p className="text-zinc-500">
                        {fact.companyName || fact.institution || fact.fieldOfStudy || fact.proficiencyLevel}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full border border-zinc-200 px-3 py-1 text-xs hover:bg-zinc-50" onClick={() => setEditing({ type, fact })}>
                        Edit
                      </button>
                      <button
                        className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white disabled:opacity-40"
                        disabled={fact.isVerified}
                        onClick={() => verify(type, fact.id).catch((reason) => setError(reason.message))}
                      >
                        {fact.isVerified ? 'Verified' : 'Verify & Accept'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
      {editing ? (
        <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm p-4 z-50">
          <form className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-xl" onSubmit={saveEdit}>
            <h3 className="font-semibold text-zinc-900">Edit fact</h3>
            {editing.type === 'experience' ? (
              <>
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="jobTitle" defaultValue={editing.fact.jobTitle} />
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="companyName" defaultValue={editing.fact.companyName} />
              </>
            ) : null}
            {editing.type === 'education' ? (
              <>
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="degree" defaultValue={editing.fact.degree} />
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="institution" defaultValue={editing.fact.institution} />
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="fieldOfStudy" defaultValue={editing.fact.fieldOfStudy} />
              </>
            ) : null}
            {editing.type === 'skill' ? (
              <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="skillName" defaultValue={editing.fact.skillName} />
            ) : null}
            {editing.type === 'language' ? (
              <>
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="languageCode" defaultValue={editing.fact.languageCode} />
                <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" name="proficiencyLevel" defaultValue={editing.fact.proficiencyLevel} />
              </>
            ) : null}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
