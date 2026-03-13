'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ZodiacSign } from '@/lib/zodiac';

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
          <p className="text-white-dim text-sm">Weekly Horoscope</p>

          {/* Period tabs */}
          <div className="flex justify-center gap-4 mt-6">
            <Link href={`/horoscope/${sign.slug}`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              Daily
            </Link>
            <span className="text-xs text-gold px-3 py-1.5 rounded-full border border-gold/20 bg-gold/10">
              Weekly
            </span>
            <Link href={`/horoscope/${sign.slug}/monthly`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
              Monthly
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="glass-card p-10 text-center">
            <motion.div
              className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm text-white-dim mt-4">Consulting the stars...</p>
          </div>
        ) : reading ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Quick stats */}
            {(reading.best_day || reading.challenge_day) && (
              <div className="glass-card p-6 flex justify-around">
                {reading.best_day && (
                  <div className="text-center">
                    <p className="text-xs text-white-dim mb-1">Best Day</p>
                    <p className="text-sm font-medium text-gold">{reading.best_day}</p>
                  </div>
                )}
                {reading.best_day && reading.challenge_day && <div className="w-px bg-white/10" />}
                {reading.challenge_day && (
                  <div className="text-center">
                    <p className="text-xs text-white-dim mb-1">Challenge Day</p>
                    <p className="text-sm font-medium text-gold">{reading.challenge_day}</p>
                  </div>
                )}
              </div>
            )}

            {/* Themes */}
            {reading.themes && reading.themes.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {reading.themes.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Main reading */}
            <div className="glass-card p-8 md:p-10">
              <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">This Week&apos;s Overview</h2>
              <p className="text-white-muted leading-relaxed font-light text-[15px]">{reading.reading}</p>
              <p className="text-[10px] text-gold/30 mt-4">✦ AI-generated based on current planetary transits</p>
            </div>

            {/* Love & Career */}
            {reading.love_forecast && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">♡</span>
                  <h3 className="text-sm font-medium">Love This Week</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.love_forecast}</p>
              </div>
            )}

            {reading.career_forecast && (
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold/60 text-lg">◇</span>
                  <h3 className="text-sm font-medium">Career This Week</h3>
                </div>
                <p className="text-white-muted text-sm leading-relaxed font-light">{reading.career_forecast}</p>
              </div>
            )}

            {/* Advice */}
            {reading.advice && (
              <div className="glass-card p-8 border border-gold/10">
                <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Weekly Wisdom</h3>
                <p className="text-white-muted text-sm leading-relaxed font-light italic">&ldquo;{reading.advice}&rdquo;</p>
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
          <Link href={`/horoscope/${prev.slug}/weekly`} className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors">
            <span>←</span><span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link href={`/horoscope/${next.slug}/weekly`} className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors">
            <span>{next.name} {next.symbol}</span><span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
