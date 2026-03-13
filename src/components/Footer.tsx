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
              <span className="text-sm opacity-40">✦</span>
              <span className="font-heading text-sm tracking-[0.1em] uppercase opacity-70">Ask the Stars</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              AI-powered personal astrology readings.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Horoscopes</h3>
            <div className="flex flex-col gap-2">
              {zodiacSigns.slice(0, 6).map((sign) => (
                <Link
                  key={sign}
                  href={`/horoscope/${sign.toLowerCase()}`}
                  className="text-xs text-white/40 hover:text-gold transition-colors"
                >
                  {sign}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">&nbsp;</h3>
            <div className="flex flex-col gap-2">
              {zodiacSigns.slice(6).map((sign) => (
                <Link
                  key={sign}
                  href={`/horoscope/${sign.toLowerCase()}`}
                  className="text-xs text-white/40 hover:text-gold transition-colors"
                >
                  {sign}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Features</h3>
            <div className="flex flex-col gap-2">
              <Link href="/birth-chart" className="text-xs text-white/40 hover:text-gold transition-colors">
                Birth Chart
              </Link>
              <Link href="/compatibility" className="text-xs text-white/40 hover:text-gold transition-colors">
                Compatibility
              </Link>
              <Link href="/chat" className="text-xs text-white/40 hover:text-gold transition-colors">
                AI Astrologer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20">
            © {new Date().getFullYear()} Ask the Stars
          </p>
          <p className="text-[10px] text-white/20">
            For entertainment purposes. The stars guide, but you decide.
          </p>
        </div>

        {/* Easter egg: tiny telescope */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8"
        >
          <span className="text-[10px] opacity-20 hover:opacity-40 transition-opacity cursor-default" title="You found the telescope!">
            🔭
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
