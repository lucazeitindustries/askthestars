'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/horoscope/aries', label: 'Daily Horoscope' },
  { href: '/birth-chart', label: 'Birth Chart' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/chat', label: 'Ask the Stars' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [twinkle, setTwinkle] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onMouseEnter={() => setTwinkle(true)}
          onMouseLeave={() => setTwinkle(false)}
          data-sound="twinkle"
        >
          <motion.span
            className="text-2xl"
            animate={twinkle ? {
              scale: [1, 1.3, 0.9, 1.2, 1],
              opacity: [1, 0.6, 1, 0.8, 1],
              rotate: [0, 15, -10, 5, 0],
            } : {}}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            ✦
          </motion.span>
          <span className="text-lg font-semibold tracking-tight text-gradient-gold">
            Ask the Stars
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white-muted hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/birth-chart"
            className="text-sm bg-gold/10 text-gold border border-gold/20 px-4 py-2 rounded-full hover:bg-gold/20 transition-all duration-200"
          >
            Get Free Reading
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`w-5 h-px bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`w-5 h-px bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-navy/95 backdrop-blur-xl border-b border-white/5 px-6 py-6 flex flex-col gap-4"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-white-muted hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/birth-chart"
              onClick={() => setOpen(false)}
              className="text-sm bg-gold/10 text-gold border border-gold/20 px-4 py-2 rounded-full text-center hover:bg-gold/20 transition-all"
            >
              Get Free Reading
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
