'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ZodiacSign } from '@/lib/zodiac';
import ScrollReveal from '@/components/ScrollReveal';

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
      <div className="content-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-6xl md:text-7xl block mb-4 zodiac-breathe inline-block">{sign.symbol}</span>
          <h1 className="text-section mb-2">
            <span className="text-gradient-gold">{sign.name}</span>
          </h1>
          <p className="text-tertiary text-sm">Monthly Horoscope{reading?.month ? ` — ${reading.month}` : ''}</p>

          <div className="flex justify-center gap-3 mt-6">
            <Link href={`/horoscope/${sign.slug}`} className="text-xs text-tertiary hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              Daily
            </Link>
            <Link href={`/horoscope/${sign.slug}/weekly`} className="text-xs text-tertiary hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
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
            <p className="text-sm text-tertiary mt-4">Channeling the monthly forecast...</p>
            <div className="mt-6 space-y-3 max-w-xs mx-auto">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-4 w-3/5" />
            </div>
          </div>
        ) : reading ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {reading.overall_theme && (
              <ScrollReveal>
                <div className="text-center">
                  <span className="text-xs px-4 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                    Theme: {reading.overall_theme}
                  </span>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div className="glass-card p-8 md:p-10">
                <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">Monthly Overview</h2>
                <p className="text-secondary leading-relaxed font-light text-body">{reading.reading}</p>
                <p className="text-[10px] text-gold/30 mt-4">✦ AI-generated monthly forecast</p>
              </div>
            </ScrollReveal>

            {reading.love && (
              <ScrollReveal delay={0.15}>
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60 text-lg">♡</span>
                    <h3 className="text-sm font-medium">Love & Relationships</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed font-light">{reading.love}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.career && (
              <ScrollReveal delay={0.2}>
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60 text-lg">◇</span>
                    <h3 className="text-sm font-medium">Career & Purpose</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed font-light">{reading.career}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.finances && (
              <ScrollReveal delay={0.25}>
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60 text-lg">⬡</span>
                    <h3 className="text-sm font-medium">Finances</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed font-light">{reading.finances}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.wellness && (
              <ScrollReveal delay={0.3}>
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/60 text-lg">○</span>
                    <h3 className="text-sm font-medium">Health & Wellness</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed font-light">{reading.wellness}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.key_dates && reading.key_dates.length > 0 && (
              <ScrollReveal delay={0.35}>
                <div className="glass-card p-8">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">Key Dates</h3>
                  <div className="space-y-2">
                    {reading.key_dates.map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-gold/40 mt-0.5 shrink-0">✦</span>
                        <p className="text-secondary text-sm font-light">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {reading.mantra && (
              <ScrollReveal delay={0.4}>
                <div className="glass-card p-8 border border-gold/10 text-center">
                  <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Monthly Mantra</h3>
                  <p className="text-secondary text-lg leading-relaxed font-light italic">&ldquo;{reading.mantra}&rdquo;</p>
                </div>
              </ScrollReveal>
            )}
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-16 pt-8 border-t border-white/5"
        >
          <Link href={`/horoscope/${prev.slug}/monthly`} className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors">
            <span>←</span><span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link href={`/horoscope/${next.slug}/monthly`} className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors">
            <span>{next.name} {next.symbol}</span><span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
