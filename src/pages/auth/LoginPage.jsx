import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import PillSwap from '../../components/PillSwap';
import { surfaces } from '../../lib/surfaces';

/** Public auth entry — bounce to role portals (`/login`). */
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();

  useEffect(() => {
    if (roleParam === 'RECRUITER') {
      window.location.replace(surfaces.recruiterLogin());
      return;
    }
    if (roleParam === 'ADMIN' || roleParam === 'SUPERADMIN' || roleParam === 'SUBADMIN') {
      window.location.replace(surfaces.adminLogin());
      return;
    }
    if (roleParam === 'CANDIDATE') {
      window.location.replace(surfaces.candidateLogin());
    }
  }, [roleParam]);

  if (roleParam === 'RECRUITER' || roleParam === 'CANDIDATE' || roleParam === 'ADMIN' || roleParam === 'SUPERADMIN' || roleParam === 'SUBADMIN') {
    return (
      <main className="mx-auto max-w-md px-6 py-16 min-h-screen rw-paper-wash text-center text-sm text-[var(--rw-muted)]">
        Redirecting to sign in…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10 sm:py-16 min-h-screen rw-paper-wash">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.1)] bg-[var(--rw-surface)]/80 px-3 py-1.5 text-xs font-semibold text-[var(--rw-muted)] shadow-sm hover:bg-[var(--rw-surface)] transition"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <Link to="/" className="inline-flex mb-3" aria-label="RightWay home">
          <Logo className="h-12 w-12 rounded-2xl text-xl" />
        </Link>
        <h1 className="text-2xl font-display font-bold tracking-tight text-[var(--rw-ink)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--rw-muted)]">Pick your portal.</p>
      </div>

      <div className="rounded-2xl border border-[rgba(10,10,10,0.08)] bg-[var(--rw-surface)]/90 p-6 shadow-sm">
        <PillSwap
          className="flex flex-wrap gap-2"
          defaultActive={0}
          itemClassName="inline-flex flex-1 items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold transition cursor-pointer"
        >
          <a href={surfaces.candidateLogin()}>Candidate</a>
          <a href={surfaces.recruiterLogin()}>Recruiter</a>
        </PillSwap>
      </div>
    </main>
  );
}
