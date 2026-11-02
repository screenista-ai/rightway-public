import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import Logo from '../../components/Logo';
import ShellMobileNav from '../../components/ShellMobileNav';
import {
  LayoutDashboard,
  UserRound,
  Files,
  FileText,
  Briefcase,
  KanbanSquare,
  Settings,
  Plus,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const links = [
  { href: '/portal/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/portal/profile', label: 'My Profile', icon: UserRound },
  { href: '/portal/resumes', label: 'My Resumes', icon: FileText },
  { href: '/portal/documents', label: 'My Documents', icon: Files },
  { href: '/portal/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/portal/applications', label: 'Applications', icon: KanbanSquare },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
];

function signOut(navigate) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  navigate('/auth/login?role=candidate');
}

export default function PortalLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Candidate';
  const currentSection = links.find((l) => l.href === pathname)?.label || 'Overview';

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-zinc-900">
      <aside className="sticky top-0 hidden h-screen min-h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-zinc-200/80 bg-white p-4 md:flex">
        <div>
          <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
            <Logo className="h-7 w-7" />
            <span className="text-base font-bold tracking-tight text-zinc-950">RightWay</span>
          </Link>

          <Link
            to="/portal/jobs"
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            <Plus size={14} />
            Browse jobs
          </Link>

          <nav className="space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    active
                      ? 'bg-zinc-100 font-semibold text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-zinc-950' : 'text-zinc-400'} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-100 pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="truncate text-xs font-bold text-zinc-900">{userName}</p>
              <p className="truncate text-[11px] text-zinc-400">Candidate Portal</p>
            </div>
            <button
              type="button"
              onClick={() => signOut(navigate)}
              title="Sign Out"
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-zinc-200/80 bg-white/95 px-3 py-3 backdrop-blur sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <ShellMobileNav
              brand="Candidate"
              brandHref="/portal/dashboard"
              links={links}
              footer={
                <button
                  type="button"
                  onClick={() => signOut(navigate)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2 text-xs font-semibold text-zinc-700"
                >
                  <LogOut size={14} /> Sign out
                </button>
              }
            />
            <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-zinc-500">
              <span className="hidden sm:inline">Candidate</span>
              <ChevronRight size={12} className="hidden text-zinc-300 sm:block" />
              <span className="truncate font-semibold text-zinc-900">{currentSection}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
