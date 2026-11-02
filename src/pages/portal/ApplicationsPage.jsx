import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const columns = ['QUEUED', 'SUBMITTED', 'DELIVERED', 'REPLIED', 'INTERVIEW'];

export default function ApplicationsPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/applications')
      .then((body) => setItems(body.items || []))
      .catch((reason) => setError(reason.message));
  }, []);

  async function expand(id) {
    setOpen(id);
    const row = await api(`/applications/${id}/timeline`);
    setTimeline(row);
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold">Applications</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        {columns.map((status) => (
          <section key={status} className="rounded-2xl bg-zinc-100 p-3">
            <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{status}</h2>
            <div className="mt-3 space-y-3">
              {items
                .filter((item) => item.status === status || (status === 'QUEUED' && item.status === 'DISPATCHING'))
                .map((item) => (
                  <button
                    key={item.id}
                    className="w-full rounded-xl bg-white p-3 text-left text-sm shadow-sm hover:shadow transition"
                    onClick={() => expand(item.id).catch((reason) => setError(reason.message))}
                  >
                    <p className="font-medium text-zinc-900">{item.vacancy.title}</p>
                    <p className="text-zinc-500 text-xs mt-1">{item.vacancy.companyName}</p>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
      {open && timeline ? (
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{timeline.vacancy.title}</h2>
          <ol className="mt-4 space-y-3">
            {(timeline.communications || []).map((message) => (
              <li key={message.id} className="rounded-xl bg-zinc-50 p-3 text-sm border border-zinc-100">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{message.subject}</p>
                  {message.classification ? (
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">{message.classification}</span>
                  ) : null}
                </div>
                <p className="text-zinc-500 text-xs mt-0.5">{message.sender}</p>
                <p className="mt-2 text-zinc-700">{message.bodyClean}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
