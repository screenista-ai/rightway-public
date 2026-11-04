import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL, toUserFriendlyMessage } from '../../lib/api';
import Logo from '../../components/Logo';
import { surfaces } from '../../lib/surfaces';

const PORTALS = {
  CANDIDATE: {
    title: 'Candidate Sign In',
    blurb: 'Fact Vault, Europass CVs & Blue Card auto-match.',
    accent: 'zinc',
    loginRole: 'CANDIDATE',
    registerHref: '/auth/register?role=candidate',
  },
  RECRUITER: {
    title: 'Recruiter Sign In',
    blurb: 'Post EU vacancies & search verified talent.',
    accent: 'blue',
    loginRole: 'RECRUITER',
    registerHref: '/auth/register?role=recruiter',
  },
  ADMIN: {
    title: 'Admin / Staff Sign In',
    blurb: '',
    accent: 'purple',
    loginRole: 'SUPERADMIN',
    registerHref: '/auth/register?role=admin',
  },
};

function resolvePortal(roleParam) {
  if (roleParam === 'RECRUITER') return 'RECRUITER';
  if (roleParam === 'ADMIN' || roleParam === 'SUPERADMIN' || roleParam === 'SUBADMIN') return 'ADMIN';
  return 'CANDIDATE';
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();
  const portalKey = resolvePortal(roleParam);
  const portal = PORTALS[portalKey];

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const headingClass = useMemo(() => {
    if (portal.accent === 'blue') return 'text-blue-700';
    if (portal.accent === 'purple') return 'text-purple-700';
    return 'text-zinc-900';
  }, [portal.accent]);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const loginRole = portal.loginRole;
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: data.get('email'),
          password: data.get('password'),
          role: loginRole,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(toUserFriendlyMessage(body, response.status));
      }
      localStorage.setItem('access_token', body.access_token);
      if (body.user) {
        localStorage.setItem('user_role', body.user.role);
        localStorage.setItem('user_name', `${body.user.firstName || ''} ${body.user.lastName || ''}`.trim());
      }

      const role = body.user?.role || 'CANDIDATE';
      if (role === 'RECRUITER') {
        window.location.href = surfaces.recruiterHome();
      } else if (role === 'SUPERADMIN' || role === 'SUBADMIN' || role === 'CONSULTANT') {
        window.location.href = surfaces.adminHome();
      } else {
        window.location.href = surfaces.candidateHome();
      }
    } catch (err) {
      setError(toUserFriendlyMessage(err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10 sm:py-16">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <Link to="/" className="inline-flex mb-3" aria-label="RightWay home">
          <Logo className="h-12 w-12 rounded-2xl text-xl" />
        </Link>
        <h1 className={`text-2xl font-bold tracking-tight ${headingClass}`}>{portal.title}</h1>
        {portal.blurb ? <p className="mt-1 text-sm text-zinc-500">{portal.blurb}</p> : null}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {portalKey !== 'ADMIN' ? (
          <div className="mb-4 flex gap-2 text-[11px] font-semibold">
            <Link
              to="/auth/login?role=candidate"
              className={`rounded-full px-3 py-1 ${portalKey === 'CANDIDATE' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              Candidate
            </Link>
            <Link
              to="/auth/login?role=recruiter"
              className={`rounded-full px-3 py-1 ${portalKey === 'RECRUITER' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              Recruiter
            </Link>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Email address</label>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:border-zinc-900 focus:outline-none"
              name="email"
              type="email"
              required
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 pr-10 text-sm focus:border-zinc-900 focus:outline-none"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition cursor-pointer p-0.5 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign in as ${portalKey === 'ADMIN' ? 'Admin' : portalKey.charAt(0) + portalKey.slice(1).toLowerCase()}`}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Don&apos;t have this role yet?{' '}
        <Link to={portal.registerHref} className="font-medium text-zinc-900 underline">
          Create {portalKey === 'ADMIN' ? 'admin' : portalKey.toLowerCase()} account
        </Link>
      </p>
    </main>
  );
}
