'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ZodiacSign } from '@/lib/zodiac';

interface MonthlyReading {
  reading: string;
  month?: string;
  overall_theme?: string;
  love?: string;
  career?: string;
  finances?: string;
  wellness?: string;
  key_dates?: string[];
  power_days?: number[];
  mantra?: string;
}

interface Props {
  sign: ZodiacSign;
  prev: ZodiacSign;
  next: ZodiacSign;
}

export default function MonthlyClient({ sign, prev, next }: Props) {
  const [reading, setReading] = useState<MonthlyReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/horoscope/${sign.slug}/monthly`)
      .then((res) => res.json())
      .then((data) => setReading(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sign.slug]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-6xl md:text-7xl block mb-4">{sign.symbol}</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            <span className="text-gradient-gold">{sign.name}</span>
          </h1>
          <p className="text-white-dim text-sm">Monthly Horoscope{reading?.month ? ` — ${reading.month}` : ''}</p>

          {/* Period tabs */}
          <div className="flex justify-center gap-4 mt-6">
            <Link href={`/horoscope/${sign.slug}`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              Daily
            </Link>
            <Link href={`/horoscope/${sign.slug}/weekly`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              Weekly
            </Link>
            <span className="text-xs text-gold px-3 py-1.5 rounded-full border border-gold/20 bg-gold/10">
              Monthly
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="glass-card p-10 text-center">
            <motion.div
              className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm text-white-dim mt-4">Channeling the monthly forecast...</p>
          </div>
        ) : reading ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Theme */}
            {reading.overall_theme && (
              <div className="text-center">
                <span className="text-xs px-4 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                  Theme: {reading.overall_theme}
                </span>
              </div>
            )}

            {/* Main reading */}
            <div className="glass-card p-8 md:p-10">
              <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">Monthly Overview</h2>
              <p className="text-white-muted leading-relaxed font-light text-[15px]">{reading.reading}</p>
              <p className="text-[10px] text-gold/30 mt-4">✦ AI-generated monthly forecast</p>
            </div>

            {/* Sections */}
            {reading.love && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">♡</span>
                  <h3 className="text-sm font-medium">Love & Relationships</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.love}</p>
              </div>
            )}

            {reading.career && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">◇</span>
                  <h3 className="text-sm font-medium">Career & Purpose</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.career}</p>
              </div>
            )}

            {reading.finances && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">⬡</span>
                  <h3 className="text-sm font-medium">Finances</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.finances}</p>
              </div>
            )}

            {reading.wellness && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">○</span>
                  <h3 className="text-sm font-medium">Health & Wellness</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.wellness}</p>
              </div>
            )}

            {/* Key dates */}
            {reading.key_dates && reading.key_dates.length > 0 && (
              <div className="glass-card p-8">
                <h3 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">Key Dates</h3>
                <div className="space-y-2">
                  {reading.key_dates.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-gold/40 mt-0.5 shrink-0">✦</span>
                      <p className="text-white-muted text-sm font-light">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mantra */}
            {reading.mantra && (
              <div className="glass-card p-8 border border-gold/10 text-center">
                <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Monthly Mantra</h3>
                <p className="text-white-muted text-lg leading-relaxed font-light italic">&ldquo;{reading.mantra}&rdquo;</p>
              </div>
            )}
          </motion.div>
        ) : null}

        {/* Nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-16 pt-8 border-t border-white/5"
        >
          <Link href={`/horoscope/${prev.slug}/monthly`} className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors">
            <span>←</span><span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link href={`/horoscope/${next.slug}/monthly`} className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors">
            <span>{next.name} {next.symbol}</span><span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
