import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import PillSwap from '../../components/PillSwap';
import { surfaces } from '../../lib/surfaces';

/** Public auth entry — bounce to role portals (`/signup`). */
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();

  useEffect(() => {
    if (roleParam === 'RECRUITER') {
      window.location.replace(surfaces.recruiterRegister());
      return;
    }
    if (roleParam === 'CANDIDATE') {
      window.location.replace(surfaces.candidateRegister());
    }
  }, [roleParam]);

  if (roleParam === 'RECRUITER' || roleParam === 'CANDIDATE') {
    return (
      <main className="mx-auto max-w-md px-6 py-16 min-h-screen rw-paper-wash text-center text-sm text-[var(--rw-muted)]">
        Redirecting to sign up…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10 sm:py-12 min-h-screen rw-paper-wash">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.1)] bg-[var(--rw-surface)]/80 px-3 py-1.5 text-xs font-semibold text-[var(--rw-muted)] shadow-sm hover:bg-[var(--rw-surface)] transition"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
      </div>

      <div className="text-center mb-6">
        <Link to="/" className="inline-flex mb-3" aria-label="RightWay home">
          <Logo className="h-12 w-12 rounded-2xl text-xl" />
        </Link>
        <h1 className="text-2xl font-display font-bold tracking-tight text-[var(--rw-ink)]">
          Create account
        </h1>
        <p className="mt-1 text-sm text-[var(--rw-muted)]">Pick your portal.</p>
      </div>

      <div className="rounded-2xl border border-[rgba(10,10,10,0.08)] bg-[var(--rw-surface)]/90 p-6 shadow-sm">
        <PillSwap
          className="flex flex-wrap gap-2"
          defaultActive={0}
          itemClassName="inline-flex flex-1 items-center justify-center rounded-full border px-4 py-2.5 text-xs font-semibold transition cursor-pointer"
        >
          <a href={surfaces.candidateRegister()}>Candidate</a>
          <a href={surfaces.recruiterRegister()}>Recruiter</a>
        </PillSwap>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--rw-muted)]">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-[var(--rw-ink)] underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
