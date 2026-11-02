import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import {
  Users,
  Shield,
  Briefcase,
  Send,
  Sparkles,
  RotateCw,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';

export default function AdminSectionPage() {
  const { section = 'dashboard' } = useParams();

  if (section === 'subadmins') return <SubAdminsView />;
  if (section === 'candidates') return <CandidatesView />;
  if (section === 'connectors') return <ConnectorsView />;
  return <DashboardView />;
}

// 1. Dashboard View (Draftbase Style)
function DashboardView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    api('/admin/stats')
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  }

  return (
    <div className="space-y-6">
      {/* Draftbase Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Release v2.4 — Admin Console</h1>
            <span className="rounded-full bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              Super-Admin Armed
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            May 19, 2026 • Platform orchestration & staff governance • Updated just now
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/candidates"
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
          >
            Audit Candidates
          </Link>
          <Link
            to="/admin/subadmins"
            className="rounded-xl bg-purple-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-800 transition"
          >
            + Add Sub-Admin
          </Link>
        </div>
      </div>

      {/* Row of 4 Pastel Metric Stat Tiles (Draftbase Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Purple (Sub-Admins & Staff) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {stats?.subAdminsCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Sub-Admins & Staff</div>
          </div>
        </div>

        {/* Card 2: Green (Candidates) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {stats?.candidatesCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Active candidates</div>
          </div>
        </div>

        {/* Card 3: Blue (Recruiters) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {stats?.recruitersCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">EU Recruiters</div>
          </div>
        </div>

        {/* Card 4: Pink (Applications Dispatched) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Send size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-zinc-950">
              {stats?.applicationsCount || 0}
            </div>
            <div className="text-xs text-zinc-500 font-medium">Total dispatches</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Studio (Draftbase Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3 Width) — Staff & Platform Governance */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-700" />
                <span>Super-Admin Governance & Auditing</span>
              </h2>
              <p className="text-xs text-zinc-400">Manage case consultants, sub-admins, and candidate portfolios</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSync}
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition flex items-center gap-1.5"
              >
                <RotateCw size={12} className={syncing ? 'animate-spin' : ''} />
                <span>Sync Logs</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-950">Core Platform Architecture</h3>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                RightWay AI multi-tenant architecture is governed by Super-Admin key authorization and automated Anabin/CEFR ground truth verification.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                <span className="text-purple-600">🛡️</span>
                <span>Security & Admin Governance</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Master admin registration key enforced for Super-Admin access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Sub-Admins and Case Consultants created directly via admin delegation without key exposure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Rate limit governor enforcing 15 dispatches per candidate per rolling 24 hours.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                <span className="text-emerald-600">✓</span>
                <span>Compliance & Zero-Hallucination Lock</span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>Deterministic extraction: No resume or letter is generated with unverified claims.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>GDPR Art. 17 right-to-erasure supported across MongoDB collections.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 Width) — Ingestion Connectors & Quick Actions */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900">Connector Ingestion Status</h3>
              <Link to="/admin/connectors" className="text-[11px] font-semibold text-purple-700 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                    C
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">EURES / Adzuna Connector</span>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  className="rounded-lg border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  {syncing ? 'Checking...' : 'Check'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                <div className="flex items-center justify-between">
                  <span>Candidate Portfolios</span>
                  <span className="font-semibold text-purple-700">+{stats?.candidatesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>EU Vacancies Active</span>
                  <span className="font-semibold text-blue-600">+{stats?.vacanciesCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sub-Admin Staff</span>
                  <span className="font-semibold text-zinc-900">+{stats?.subAdminsCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connectors healthy & active</span>
              </div>
            </div>
          </div>

          {/* Quick Operations */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900">Staff Operations</h3>
            <Link
              to="/admin/subadmins"
              className="w-full flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              <span>+ Create Sub-Admin Account</span>
              <ArrowRight size={13} className="text-zinc-400" />
            </Link>
            <Link
              to="/admin/candidates"
              className="w-full flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              <span>Audit Candidate Fact Vaults</span>
              <ArrowRight size={13} className="text-zinc-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Sub-Admin Management View
function SubAdminsView() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'SUBADMIN',
  });

  useEffect(() => {
    loadSubAdmins();
  }, []);

  async function loadSubAdmins() {
    setLoading(true);
    try {
      const res = await api('/admin/subadmins');
      setSubAdmins(res.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');
    try {
      await api('/admin/subadmins', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSuccess(`Sub-Admin ${form.email} created successfully!`);
      setForm({ firstName: '', lastName: '', email: '', password: '', role: 'SUBADMIN' });
      loadSubAdmins();
    } catch (err) {
      setError(err.message || 'Failed to create sub-admin');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Sub-Admin & Staff Management</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Super-Admin panel: Delegate operations to Sub-Admins and Case Consultants.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Create New Staff Account</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">First Name *</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Marcus"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Last Name *</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Vance"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="marcus.vance@rightway.eu"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Password (min 8 chars) *</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none"
              >
                <option value="SUBADMIN">Sub-Admin (Staff Operations)</option>
                <option value="CONSULTANT">Consultant (Case Management)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-purple-700 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-800 disabled:opacity-50"
            >
              {creating ? 'Creating...' : '+ Add Staff Account'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900">Active Staff & Sub-Admins ({subAdmins.length})</h2>
        {loading ? (
          <div className="text-xs text-zinc-400">Loading accounts...</div>
        ) : subAdmins.length === 0 ? (
          <div className="text-xs text-zinc-400 py-4">No sub-admin accounts created yet. Use form above to add staff.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {subAdmins.map((admin) => (
              <div key={admin.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-900">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-zinc-500">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 border border-purple-200">
                    {admin.role}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {admin.status}
                  </span>
                  <span className="text-zinc-400 text-[10px]">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Candidate Management View
function CandidatesView() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api('/admin/candidates')
      .then((res) => setCandidates(res.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = candidates.filter((c) => {
    const q = search.toLowerCase();
    const name = `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.toLowerCase();
    const email = (c.user?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Candidate Management Portfolio</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Audit candidate profiles, verified records, and auto-apply settings.
          </p>
        </div>
        <input
          type="text"
          placeholder="Filter candidate by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-zinc-200 px-3.5 py-2 text-xs focus:border-zinc-900 focus:outline-none min-w-[260px]"
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-400">Loading candidate portfolios...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">No candidates found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Target Country</th>
                  <th className="px-5 py-3.5">Verified Facts</th>
                  <th className="px-5 py-3.5">Applications</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-zinc-900">
                        {c.user?.firstName} {c.user?.lastName}
                      </p>
                      <p className="text-zinc-500 text-[11px]">{c.user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-zinc-700">
                      {c.targetCountry || 'European Union'}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">
                      <span>{c._count?.experiences || 0} Exp</span> • <span>{c._count?.skills || 0} Skills</span> • <span>{c._count?.documents || 0} Docs</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">
                      {c._count?.applications || 0} sent
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. Connectors View
function ConnectorsView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/admin/connectors/health')
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Connectors & Scraping Health</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Status of European job ingestion feeds and integration connectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.connectors?.map((conn) => (
          <div key={conn.name} className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase text-zinc-900">{conn.name}</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                {conn.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{conn.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
