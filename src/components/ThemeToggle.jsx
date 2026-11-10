import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function readTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  try {
    const saved = localStorage.getItem('rw_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem('rw_theme', theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('rw-theme', { detail: theme }));
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' ? readTheme() : 'light'
  );

  useEffect(() => {
    const t = readTheme();
    setTheme(t);
    applyTheme(t);

    function onTheme(e) {
      const next = e?.detail || readTheme();
      setTheme(next);
    }
    function onStorage(e) {
      if (e.key === 'rw_theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    }
    window.addEventListener('rw-theme', onTheme);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('rw-theme', onTheme);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[var(--rw-nav-ink)] hover:bg-white/15 hover:border-white/35 transition shrink-0 cursor-pointer ${className}`}
    >
      {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
    </button>
  );
}
