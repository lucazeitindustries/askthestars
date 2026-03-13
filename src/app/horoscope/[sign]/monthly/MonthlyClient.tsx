'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex justify-center mb-6"
          >
            <Image
              src={`/illustrations/zodiac-${sign.slug}.png`}
              alt={`${sign.name} zodiac illustration`}
              width={180}
              height={180}
              style={{ opacity: 0.7, width: '100%', maxWidth: 180, height: 'auto' }}
            />
          </motion.div>
          <h1 className="text-section mb-3 text-white/90">
            {sign.name}
          </h1>
          <p className="text-white/30 text-xs tracking-wide">Monthly Horoscope{reading?.month ? ` — ${reading.month}` : ''}</p>

          <div className="flex justify-center gap-3 mt-6">
            <Link href={`/horoscope/${sign.slug}`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
              Daily
            </Link>
            <Link href={`/horoscope/${sign.slug}/weekly`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
              Weekly
            </Link>
            <span className="text-xs text-gold px-3 py-1.5 border border-gold/20">
              Monthly
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-xs text-white/30 mt-4">Channeling the monthly forecast...</p>
            <div className="mt-6 space-y-3 max-w-xs mx-auto">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-4 w-3/5" />
            </div>
          </div>
        ) : reading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {reading.overall_theme && (
              <ScrollReveal>
                <div className="text-center">
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                    Theme: {reading.overall_theme}
                  </span>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">Monthly Overview</p>
                <p className="text-white/70 leading-relaxed font-light text-body">{reading.reading}</p>
                <p className="text-[10px] text-white/20 mt-6">✦ AI-generated monthly forecast</p>
              </div>
            </ScrollReveal>

            {reading.love && (
              <ScrollReveal delay={0.15}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Love & Relationships</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.love}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.career && (
              <ScrollReveal delay={0.2}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Career & Purpose</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.career}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.finances && (
              <ScrollReveal delay={0.25}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Finances</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.finances}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.wellness && (
              <ScrollReveal delay={0.3}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Health & Wellness</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.wellness}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.key_dates && reading.key_dates.length > 0 && (
              <ScrollReveal delay={0.35}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Key Dates</p>
                  <div className="space-y-2">
                    {reading.key_dates.map((d, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-white/20 mt-0.5 shrink-0">✦</span>
                        <p className="text-white/50 text-sm font-light">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {reading.mantra && (
              <ScrollReveal delay={0.4}>
                <div className="border-t border-white/5 pt-8 text-center">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Monthly Mantra</p>
                  <p className="text-white/50 text-lg leading-relaxed font-light font-heading italic">&ldquo;{reading.mantra}&rdquo;</p>
                </div>
              </ScrollReveal>
            )}
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-20 pt-8 border-t border-white/5"
        >
          <Link href={`/horoscope/${prev.slug}/monthly`} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <span>←</span><span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link href={`/horoscope/${next.slug}/monthly`} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <span>{next.name} {next.symbol}</span><span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
