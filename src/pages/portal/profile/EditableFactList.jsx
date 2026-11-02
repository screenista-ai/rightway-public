import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import ActionPair from '../../../components/ActionPair.jsx';

const inputClass =
  'w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-zinc-400';

/**
 * List with inline edit + Fact Vault verify.
 * fields: [{ key, label, type?: 'text'|'textarea'|'checkbox'|'number' }]
 */
export default function EditableFactList({
  title,
  items,
  empty,
  fields,
  renderSummary,
  onSaveItem,
  onRemove,
  onVerify,
  extra,
  saving,
}) {
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(item) {
    const id = item._id || item.id;
    const next = {};
    for (const f of fields) {
      const v = item[f.key];
      next[f.key] = Array.isArray(v) ? v.join(', ') : v ?? (f.type === 'checkbox' ? false : '');
    }
    setDraft(next);
    setEditId(id);
  }

  async function save(item) {
    const id = item._id || item.id;
    const body = {};
    for (const f of fields) {
      let v = draft[f.key];
      if (f.asCsv) v = String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (f.type === 'number') v = v === '' ? undefined : Number(v);
      if (f.type === 'checkbox') v = Boolean(v);
      body[f.key] = v;
    }
    await onSaveItem(id, body);
    setEditId(null);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-zinc-500">{empty}</p> : null}
      <ul className="space-y-2">
        {items.map((item) => {
          const id = item._id || item.id;
          const editing = editId === id;
          return (
            <li key={id} className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
              {editing ? (
                <div className="space-y-2">
                  {fields.map((f) => (
                    <label key={f.key} className="block">
                      <span className="text-[11px] font-medium text-zinc-500">{f.label}</span>
                      {f.type === 'textarea' ? (
                        <textarea
                          className={inputClass + ' mt-1'}
                          rows={2}
                          value={draft[f.key] ?? ''}
                          onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        />
                      ) : f.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          className="mt-1 ml-2"
                          checked={Boolean(draft[f.key])}
                          onChange={(e) => setDraft({ ...draft, [f.key]: e.target.checked })}
                        />
                      ) : (
                        <input
                          type={f.type === 'number' ? 'number' : 'text'}
                          className={inputClass + ' mt-1'}
                          value={draft[f.key] ?? ''}
                          onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        />
                      )}
                    </label>
                  ))}
                  <ActionPair
                    saving={saving}
                    dirty
                    onCancel={() => {
                      setEditId(null);
                      setDraft({});
                    }}
                    saveType="button"
                    onSave={() => save(item)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 text-sm">{renderSummary(item)}</div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title={item.isVerified ? 'Unverify' : 'Approve to Fact Vault'}
                      onClick={() => onVerify(id, !item.isVerified)}
                      className={`rounded-lg p-1.5 ${
                        item.isVerified
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-zinc-400 hover:bg-white hover:text-emerald-700'
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-white hover:text-zinc-800"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(id)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-white hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {extra}
    </div>
  );
}

export function FactVaultPanel({ profile, onVerify, onJump }) {
  const pending = [];
  const groups = [
    ['experiences', 'Experience', (e) => `${e.jobTitle} @ ${e.companyName}`],
    ['educations', 'Education', (e) => `${e.degree} — ${e.institution}`],
    ['skills', 'Skill', (e) => e.skillName],
    ['languages', 'Language', (e) => `${e.languageCode} ${e.proficiencyLevel}`],
    ['projects', 'Project', (e) => e.name],
    ['certifications', 'Certification', (e) => e.name],
  ];
  for (const [key, label, fmt] of groups) {
    for (const item of profile[key] || []) {
      if (!item.isVerified) {
        pending.push({
          collection: key,
          id: item._id || item.id,
          label,
          text: fmt(item),
          section:
            key === 'experiences'
              ? 'experience'
              : key === 'educations'
                ? 'education'
                : key === 'skills'
                  ? 'skills'
                  : key === 'languages'
                    ? 'languages'
                    : key === 'projects'
                      ? 'projects'
                      : 'certifications',
        });
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Fact Vault</div>
      <p className="text-xs text-zinc-500 leading-relaxed">
        Approve facts before resumes/applications use them. AI never invents unverified items.
      </p>
      {pending.length === 0 ? (
        <p className="text-xs text-emerald-700">No pending facts.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {pending.slice(0, 12).map((p) => (
            <li key={`${p.collection}-${p.id}`} className="rounded-lg border border-amber-100 bg-amber-50/80 p-2">
              <div className="text-[10px] font-semibold uppercase text-amber-800">{p.label}</div>
              <div className="text-xs text-zinc-800 line-clamp-2">{p.text}</div>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => onVerify(p.collection, p.id, true)}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white"
                >
                  <Check className="h-3 w-3" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => onJump(p.section)}
                  className="text-[10px] font-semibold text-zinc-600 underline"
                >
                  Open
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {pending.length > 12 ? (
        <p className="text-[10px] text-zinc-400">+{pending.length - 12} more pending</p>
      ) : null}
    </div>
  );
}

export { X };
