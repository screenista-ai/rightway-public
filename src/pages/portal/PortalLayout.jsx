import { useState } from 'react';
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
  Search,
  Bell,
  Eye,
  Send,
  LogOut,
  ChevronRight,
  Bookmark
} from 'lucide-react';

const links = [
  { href: '/portal/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/portal/profile', label: 'Profile', icon: UserRound },
  { href: '/portal/resumes', label: 'Resumes', icon: FileText },
  { href: '/portal/documents', label: 'Uploaded Documents', icon: Files },
  { href: '/portal/jobs', label: 'Blue Card Jobs', icon: Briefcase },
  { href: '/portal/applications', label: 'Applications Kanban', icon: KanbanSquare },
  { href: '/portal/settings', label: 'Settings & OAuth', icon: Settings },
];

const favorites = [
  { name: 'Resume templates', date: 'Now', href: '/portal/resumes' },
  { name: 'Berlin Backend Roles', date: 'Apr 28', href: '/portal/jobs' },
  { name: 'Zalando SE Match', date: 'Apr 15', href: '/portal/applications' },
];

export default function PortalLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const userName = localStorage.getItem('user_name') || 'Candidate';

  const currentSection = links.find((l) => l.href === pathname)?.label || 'Overview';

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans flex">
      {/* Draftbase Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-zinc-200/80 bg-white flex flex-col justify-between p-4 hidden md:flex min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Logo & Collapse */}
          <div className="flex items-center justify-between px-2 mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="font-bold text-base tracking-tight text-zinc-950">RightWay</span>
            </Link>
            <span className="rounded-md bg-zinc-100 p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
            </span>
          </div>

          {/* + New Button */}
          <Link
            to="/portal/resumes"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-2.5 px-4 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition mb-6"
          >
            <Plus size={14} />
            <span>+ New Application</span>
          </Link>

          {/* Main Navigation Links */}
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

          {/* Favorites / Quick Access List */}
          <div className="mt-8 pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Favorites</span>
            </div>
            <div className="space-y-1">
              {favorites.map((fav, i) => (
                <Link
                  key={i}
                  to={fav.href}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Bookmark size={13} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{fav.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0 ml-2">{fav.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* User Footer / Sign Out */}
        <div className="pt-4 border-t border-zinc-100">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-900 truncate">{userName}</p>
              <p className="text-[11px] text-zinc-400 truncate">Candidate Portal</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_name');
                navigate('/auth/login?role=candidate');
              }}
              title="Sign Out"
              className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Draftbase Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <ShellMobileNav
              brand="Candidate"
              brandHref="/portal/dashboard"
              links={links}
              footer={
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user_role');
                    localStorage.removeItem('user_name');
                    navigate('/auth/login?role=candidate');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2 text-xs font-semibold text-zinc-700"
                >
                  <LogOut size={14} /> Sign out
                </button>
              }
            />
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium min-w-0">
              <span className="hidden xs:inline hover:text-zinc-800 cursor-pointer">Candidate</span>
              <ChevronRight size={12} className="text-zinc-300 hidden sm:block" />
              <span className="font-semibold text-zinc-900 truncate">{currentSection}</span>
            </div>
          </div>

          {/* Central AI Search Bar with ⌘K Badge */}
          <div className="flex-1 max-w-md hidden sm:flex items-center relative">
            <Search size={14} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search / Ask AI anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50/70 pl-9 pr-12 py-1.5 text-xs focus:bg-white focus:border-zinc-900 focus:outline-none transition"
            />
            <span className="absolute right-3 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 shadow-2xs">
              ⌘K
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 transition"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <Link
              to="/portal/resumes"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs hover:bg-zinc-50 transition"
            >
              <Eye size={13} />
              <span>Preview</span>
            </Link>

            <Link
              to="/portal/applications"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
            >
              <Send size={13} />
              <span>Publish</span>
            </Link>
          </div>
        </header>

        {/* Outlet Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
