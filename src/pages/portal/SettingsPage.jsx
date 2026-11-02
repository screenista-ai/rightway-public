import { useState } from 'react';
import { api } from '../../lib/api.js';

export default function SettingsPage() {
  const [google, setGoogle] = useState('');
  const [microsoft, setMicrosoft] = useState('');
  const [error, setError] = useState('');

  async function connect(provider) {
    try {
      const body = await api(`/mailbox/connect/${provider}`);
      if (provider === 'google') setGoogle(body.authorization_url);
      else setMicrosoft(body.authorization_url);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold">Mailbox Settings</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-500">
        OAuth URLs are generated with an encrypted state token. Set GOOGLE_CLIENT_ID or MICROSOFT_CLIENT_ID before a real consent screen will accept them.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 transition" onClick={() => connect('google')}>
          Connect Google
        </button>
        <button className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 transition" onClick={() => connect('microsoft')}>
          Connect Microsoft
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {google ? <p className="mt-4 break-all text-xs text-zinc-600 bg-zinc-100 p-3 rounded-xl">{google}</p> : null}
      {microsoft ? <p className="mt-4 break-all text-xs text-zinc-600 bg-zinc-100 p-3 rounded-xl">{microsoft}</p> : null}
    </main>
  );
}
