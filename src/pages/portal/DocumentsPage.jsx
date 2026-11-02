import { useEffect, useState } from 'react';
import { API_URL, authToken } from '../../lib/api.js';

export default function DocumentsPage() {
  const [items, setItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch(`${API_URL}/candidates/documents`, {
      headers: { Authorization: `Bearer ${authToken() ?? ''}` },
    });
    if (!response.ok) throw new Error(await response.text());
    const body = await response.json();
    setItems(body.items || []);
  }

  useEffect(() => {
    load().catch((reason) => setError(reason.message));
  }, []);

  function upload(file) {
    const body = new FormData();
    body.set('file', file);
    body.set('documentType', 'CV');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/candidates/documents/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${authToken() ?? ''}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 400) {
        setError(xhr.responseText);
        return;
      }
      setProgress(0);
      load().catch((reason) => setError(reason.message));
    };
    xhr.send(body);
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold">Document vault</h1>
      <label
        className="mt-6 block rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center cursor-pointer hover:border-zinc-400 transition"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) upload(file);
        }}
      >
        <span className="text-zinc-600 font-medium">Drop a PDF, DOCX, or PNG (max 15MB)</span>
        <input
          className="mt-4 block w-full text-sm text-zinc-500 cursor-pointer"
          type="file"
          accept=".pdf,.docx,.png,application/pdf,image/png"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </label>
      {progress > 0 ? <p className="mt-3 text-sm text-zinc-600">Upload {progress}%</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <span className="font-medium text-sm text-zinc-800">{item.fileName}</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs uppercase font-semibold text-zinc-600">{item.parseStatus}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
