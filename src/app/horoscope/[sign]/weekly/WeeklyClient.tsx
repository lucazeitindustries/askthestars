'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ZodiacSign } from '@/lib/zodiac';
import ScrollReveal from '@/components/ScrollReveal';

interface WeeklyReading {
  reading: string;
  themes?: string[];
  best_day?: string;
  challenge_day?: string;
  love_forecast?: string;
  career_forecast?: string;
  advice?: string;
}

interface Props {
  sign: ZodiacSign;
  prev: ZodiacSign;
  next: ZodiacSign;
}

export default function WeeklyClient({ sign, prev, next }: Props) {
  const [reading, setReading] = useState<WeeklyReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/horoscope/${sign.slug}/weekly`)
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
          <span className="text-5xl md:text-6xl block mb-6 opacity-60">{sign.symbol}</span>
          <h1 className="text-section mb-3 text-white/90">
            {sign.name}
          </h1>
          <p className="text-white/30 text-xs tracking-wide">Weekly Horoscope</p>

          <div className="flex justify-center gap-3 mt-6">
            <Link href={`/horoscope/${sign.slug}`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
              Daily
            </Link>
            <span className="text-xs text-gold px-3 py-1.5 border border-gold/20">
              Weekly
            </span>
            <Link href={`/horoscope/${sign.slug}/monthly`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
              Monthly
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-xs text-white/30 mt-4">Consulting the stars...</p>
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
            {(reading.best_day || reading.challenge_day) && (
              <ScrollReveal>
                <div className="flex justify-around py-6 border-t border-b border-white/5">
                  {reading.best_day && (
                    <div className="text-center">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Best Day</p>
                      <p className="text-sm text-white/70">{reading.best_day}</p>
                    </div>
                  )}
                  {reading.challenge_day && (
                    <div className="text-center">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Challenge Day</p>
                      <p className="text-sm text-white/70">{reading.challenge_day}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {reading.themes && reading.themes.length > 0 && (
              <ScrollReveal>
                <div className="flex flex-wrap justify-center gap-2">
                  {reading.themes.map((t) => (
                    <span key={t} className="text-[10px] px-3 py-1 text-white/40 border border-white/10 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">This Week&apos;s Overview</p>
                <p className="text-white/70 leading-relaxed font-light text-body">{reading.reading}</p>
                <p className="text-[10px] text-white/20 mt-6">✦ AI-generated based on current planetary transits</p>
              </div>
            </ScrollReveal>

            {reading.love_forecast && (
              <ScrollReveal delay={0.15}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Love This Week</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.love_forecast}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.career_forecast && (
              <ScrollReveal delay={0.2}>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Career This Week</p>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{reading.career_forecast}</p>
                </div>
              </ScrollReveal>
            )}

            {reading.advice && (
              <ScrollReveal delay={0.25}>
                <div className="border-t border-white/5 pt-8">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Weekly Wisdom</p>
                  <p className="text-white/50 text-sm leading-relaxed font-light italic">&ldquo;{reading.advice}&rdquo;</p>
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
          <Link href={`/horoscope/${prev.slug}/weekly`} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <span>←</span><span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link href={`/horoscope/${next.slug}/weekly`} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors">
            <span>{next.name} {next.symbol}</span><span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
