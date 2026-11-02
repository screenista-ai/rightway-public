import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API_URL } from '../../lib/api';
import Logo from '../../components/Logo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();

  const [role, setRole] = useState(() => {
    if (roleParam === 'RECRUITER') return 'RECRUITER';
    if (roleParam === 'ADMIN' || roleParam === 'SUPERADMIN' || roleParam === 'SUBADMIN') return 'SUPERADMIN';
    return 'CANDIDATE';
  });

  useEffect(() => {
    if (roleParam === 'RECRUITER') setRole('RECRUITER');
    else if (roleParam === 'ADMIN' || roleParam === 'SUPERADMIN' || roleParam === 'SUBADMIN') setRole('SUPERADMIN');
    else if (roleParam === 'CANDIDATE') setRole('CANDIDATE');
  }, [roleParam]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const payload = {
        email: data.get('email'),
        password: data.get('password'),
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        role,
      };

      if (role === 'RECRUITER') {
        payload.companyName = data.get('companyName');
      }

      if (role === 'SUPERADMIN') {
        payload.adminCode = data.get('adminCode');
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || body.error || 'Registration failed');
      }
      localStorage.setItem('access_token', body.access_token);
      if (body.user) {
        localStorage.setItem('user_role', body.user.role);
        localStorage.setItem('user_name', `${body.user.firstName || ''} ${body.user.lastName || ''}`.trim());
      }

      if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else if (role === 'SUPERADMIN' || role === 'SUBADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/portal/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10 sm:py-12">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to website</span>
        </Link>
      </div>

      <div className="text-center mb-6">
        <Link to="/" className="inline-flex mb-3" aria-label="RightWay home">
          <Logo className="h-12 w-12 rounded-2xl text-xl" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {role === 'RECRUITER'
            ? 'Create Recruiter Account'
            : role === 'SUPERADMIN'
            ? 'Create Admin Account'
            : 'Create Candidate Account'}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Separate portals — same Gmail can register once per role.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {role !== 'SUPERADMIN' ? (
          <div className="mb-5 flex gap-2 text-[11px] font-semibold">
            <Link
              to="/auth/register?role=candidate"
              className={`rounded-full px-3 py-1 ${role === 'CANDIDATE' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              Candidate
            </Link>
            <Link
              to="/auth/register?role=recruiter"
              className={`rounded-full px-3 py-1 ${role === 'RECRUITER' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              Recruiter
            </Link>
          </div>
        ) : (
          <div className="mb-5 rounded-lg bg-purple-50 border border-purple-200/70 px-3 py-2 text-[11px] text-purple-700">
            Staff registration — not linked from the public site.
          </div>
        )}

        <form className="space-y-3.5" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">First name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="firstName"
                required
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Last name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="lastName"
                required
                placeholder="Doe"
              />
            </div>
          </div>

          {role === 'RECRUITER' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Company / Agency Name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="companyName"
                required
                placeholder="e.g. Amsterdam Tech Talent BV"
              />
            </div>
          ) : null}

          {role === 'SUPERADMIN' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Admin Secret Code *</label>
              <input
                className="w-full rounded-xl border border-amber-300 bg-amber-50/40 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none font-mono"
                name="adminCode"
                type="password"
                required
                placeholder="Enter master admin registration key"
              />
              <p className="mt-1 text-[11px] text-zinc-400">Restricted to authorized system administrators.</p>
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Email address</label>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Password (min 8 chars)</label>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition disabled:opacity-50 mt-2"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : `Register as ${
                  role === 'RECRUITER'
                    ? 'EU Recruiter'
                    : role === 'SUPERADMIN'
                    ? 'Super-Admin'
                    : 'Candidate'
                }`}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link
          to={`/auth/login?role=${role === 'SUPERADMIN' ? 'admin' : role.toLowerCase()}`}
          className="font-medium text-zinc-900 underline"
        >
          Sign in to this portal
        </Link>
      </p>
    </main>
  );
}
