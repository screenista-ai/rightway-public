import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function JobsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/jobs/matches')
      .then((body) => setItems(body.items || []))
      .catch((reason) => setError(reason.message));
  }, []);

  async function apply(vacancyId) {
    try {
      await api('/applications/approve', {
        method: 'POST',
        body: JSON.stringify({ vacancyId }),
      });
      navigate('/portal/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application submission failed');
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold">Job matches</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{item.vacancy?.title}</h2>
                <p className="text-sm text-zinc-500">
                  {item.vacancy?.companyName} • {item.vacancy?.city ?? 'Remote'}, {item.vacancy?.country}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {item.fitScore}% Match
                </span>
                <button
                  className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 transition"
                  onClick={() => apply(item.vacancy?.id)}
                >
                  Review & Apply
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
              <div>Skills: <strong className="text-zinc-900">{item.skillScore}%</strong></div>
              <div>Experience: <strong className="text-zinc-900">{item.experienceScore}%</strong></div>
              <div>Language: <strong className="text-zinc-900">{item.languageScore}%</strong></div>
              <div>Location: <strong className="text-zinc-900">{item.locationScore}%</strong></div>
            </div>
          </article>
        ))}
        {items.length === 0 && !error && (
          <p className="text-sm text-zinc-500">No job matches found yet. Upload and verify your CV to generate matches.</p>
        )}
      </div>
    </main>
  );
}
