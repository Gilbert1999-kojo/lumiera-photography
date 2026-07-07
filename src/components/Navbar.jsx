import { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

/* ── Nav links: Home · Portfolio · Booking ───────────────────── */
const NAV_LINKS = [
  { label: 'Home',      href: '#'         },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Booking',   href: '#booking'  },
];

export default function Navbar({ dark, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50
                 bg-white/95 dark:bg-brand-dark/95
                 border-b border-neutral-100 dark:border-brand-dark-line
                 backdrop-blur-md"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────── */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="Home">
          <span
            className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center
                       text-white font-black text-sm
                       shadow-md shadow-brand-orange/30
                       group-hover:shadow-brand-orange/50 transition-shadow"
          >
            L
          </span>
          <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white">
            Lumiera<span className="text-brand-orange">.</span>
          </span>
        </a>

        {/* ── Desktop nav links ────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1" role="navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-medium
                           text-neutral-600 dark:text-neutral-400
                           hover:text-brand-orange dark:hover:text-brand-orange
                           hover:bg-brand-orange/5 dark:hover:bg-brand-orange/10
                           transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Right controls ───────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg
                       text-neutral-500 dark:text-neutral-400
                       hover:bg-brand-orange/10 hover:text-brand-orange
                       transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* CTA — desktop */}
          <a
            href="#booking"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg
                       bg-brand-orange hover:bg-brand-orange-dark active:scale-95
                       text-white font-semibold text-sm
                       shadow-md shadow-brand-orange/25 hover:shadow-brand-orange/40
                       transition-all duration-150"
          >
            Book Now
          </a>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="md:hidden p-2 rounded-lg
                       text-neutral-500 dark:text-neutral-400
                       hover:bg-brand-orange/10 hover:text-brand-orange
                       transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden border-t border-neutral-100 dark:border-brand-dark-line
                     bg-white dark:bg-brand-dark-surface
                     px-4 pb-5 pt-3 space-y-1"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium
                         text-neutral-700 dark:text-neutral-300
                         hover:bg-brand-orange/10 hover:text-brand-orange
                         transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="block mt-2 px-3 py-3 rounded-lg text-center
                       bg-brand-orange hover:bg-brand-orange-dark
                       text-white font-bold text-sm transition-colors"
          >
            Book Now
          </a>
        </div>
      )}
    </header>
  );
}
