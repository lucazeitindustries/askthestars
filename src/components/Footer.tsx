'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/quiz')) return null;

  return (
    <footer className="relative z-10 border-t border-white/5 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✦</span>
              <span className="font-semibold text-gradient-gold">Ask the Stars</span>
            </div>
            <p className="text-sm text-white-dim leading-relaxed">
              AI-powered personal astrology readings. Discover what the cosmos has in store for you.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-white-dim mb-4">Horoscopes</h3>
            <div className="flex flex-col gap-2">
              {zodiacSigns.slice(0, 6).map((sign) => (
                <Link
                  key={sign}
                  href={`/horoscope/${sign.toLowerCase()}`}
                  className="text-sm text-white-muted hover:text-gold transition-colors"
                >
                  {sign}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-white-dim mb-4">&nbsp;</h3>
            <div className="flex flex-col gap-2">
              {zodiacSigns.slice(6).map((sign) => (
                <Link
                  key={sign}
                  href={`/horoscope/${sign.toLowerCase()}`}
                  className="text-sm text-white-muted hover:text-gold transition-colors"
                >
                  {sign}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-white-dim mb-4">Features</h3>
            <div className="flex flex-col gap-2">
              <Link href="/birth-chart" className="text-sm text-white-muted hover:text-gold transition-colors">
                Birth Chart
              </Link>
              <Link href="/compatibility" className="text-sm text-white-muted hover:text-gold transition-colors">
                Compatibility
              </Link>
              <Link href="/chat" className="text-sm text-white-muted hover:text-gold transition-colors">
                AI Astrologer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white-dim">
            © {new Date().getFullYear()} Ask the Stars. All rights reserved.
          </p>
          <p className="text-xs text-white-dim">
            For entertainment purposes. The stars guide, but you decide.
          </p>
        </div>

        {/* Easter egg: tiny telescope at the very bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8"
        >
          <span className="text-[10px] opacity-30 hover:opacity-60 transition-opacity cursor-default" title="You found the telescope!">
            🔭
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
