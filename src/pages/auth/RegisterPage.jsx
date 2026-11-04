import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL, toUserFriendlyMessage } from '../../lib/api';
import Logo from '../../components/Logo';
import { surfaces } from '../../lib/surfaces';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();
  const role = roleParam === 'RECRUITER' ? 'RECRUITER' : roleParam === 'ADMIN' ? 'SUPERADMIN' : 'CANDIDATE';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

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

      if (role === 'SUPERADMIN' || role === 'SUBADMIN') {
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
        throw new Error(toUserFriendlyMessage(body, response.status));
      }
      localStorage.setItem('access_token', body.access_token);
      if (body.user) {
        localStorage.setItem('user_role', body.user.role);
        localStorage.setItem('user_name', `${body.user.firstName || ''} ${body.user.lastName || ''}`.trim());
      }

      if (role === 'RECRUITER') {
        window.location.href = surfaces.recruiterHome();
      } else if (role === 'SUPERADMIN' || role === 'SUBADMIN') {
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
          {role === 'RECRUITER'
            ? 'Access verified EU tech talent and post jobs.'
            : role === 'SUPERADMIN'
            ? 'Authorized administrative registration only.'
            : 'Start building your verified fact CV.'}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex gap-2 text-[11px] font-semibold">
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

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">First name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="firstName"
                required
                placeholder="Ada"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Last name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="lastName"
                required
                placeholder="Lovelace"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Email address</label>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              name="email"
              type="email"
              required
              placeholder="ada@domain.com"
            />
          </div>

          {role === 'RECRUITER' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Company name</label>
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                name="companyName"
                required
                placeholder="Acme Corp"
              />
            </div>
          ) : null}

          {role === 'SUPERADMIN' || role === 'SUBADMIN' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Admin registration code</label>
              <div className="relative">
                <input
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 pr-10 text-sm focus:border-zinc-900 focus:outline-none font-mono"
                  name="adminCode"
                  type={showAdminCode ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminCode(!showAdminCode)}
                  aria-label={showAdminCode ? 'Hide admin code' : 'Show admin code'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition cursor-pointer p-0.5 focus:outline-none"
                >
                  {showAdminCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 pr-10 text-sm focus:border-zinc-900 focus:outline-none"
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link to={`/auth/login?role=${role === 'RECRUITER' ? 'recruiter' : 'candidate'}`} className="font-medium text-zinc-900 underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
