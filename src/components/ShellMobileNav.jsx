import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

/**
 * Mobile drawer for portal / recruiter / admin shells (aside is md+ only).
 */
export default function ShellMobileNav({
  brand = 'RightWay',
  brandHref = '/',
  links = [],
  footer = null,
}) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm"
      >
        <Menu size={18} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-zinc-950/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <Link to={brandHref} className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Logo className="h-7 w-7" />
                <span className="font-bold text-sm text-zinc-950">{brand}</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {links.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-zinc-100 font-semibold text-zinc-950'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {Icon ? <Icon size={16} className={active ? 'text-zinc-950' : 'text-zinc-400'} /> : null}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            {footer ? <div className="border-t border-zinc-100 p-3">{footer}</div> : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
