'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/horoscope/aries', label: 'Horoscopes' },
  { href: '/birth-chart', label: 'Birth Chart' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/chat', label: 'Ask Stella' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/quiz')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">✦</span>
          <span className="text-sm tracking-[0.1em] uppercase opacity-70 group-hover:opacity-100 transition-opacity font-heading">
            Ask the Stars
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-wide text-white/50 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/birth-chart"
            className="btn-ghost text-xs py-2 px-5"
          >
            Free Reading
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`w-5 h-px bg-white/50 transition-all duration-200 ${open ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`w-5 h-px bg-white/50 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-white/50 transition-all duration-200 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-6 flex flex-col gap-4"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/birth-chart"
              onClick={() => setOpen(false)}
              className="btn-ghost text-xs text-center py-2 px-5 w-fit"
            >
              Free Reading
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
