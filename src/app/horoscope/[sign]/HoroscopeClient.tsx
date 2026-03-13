'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ZodiacSign } from '@/lib/zodiac';

interface Props {
  sign: ZodiacSign;
  reading: {
    overall: string;
    love: string;
    career: string;
    wellness: string;
    luckyNumber: number;
    mood: string;
  };
  prev: ZodiacSign;
  next: ZodiacSign;
  today: string;
}

interface AIReading {
  reading: string;
  mood: string;
  lucky_number: number;
  color: string;
  focus_area: string;
}

export default function HoroscopeClient({ sign, reading, prev, next, today }: Props) {
  const [aiReading, setAiReading] = useState<AIReading | null>(null);

  useEffect(() => {
    // Fetch AI-generated horoscope, fall back to static reading
    fetch(`/api/horoscope/${sign.slug}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.reading) setAiReading(data);
      })
      .catch(() => {
        // Silently fall back to static reading
      });
  }, [sign.slug]);

  const displayReading = aiReading?.reading || reading.overall;
  const displayMood = aiReading?.mood || reading.mood;
  const displayLucky = aiReading?.lucky_number || reading.luckyNumber;
  const displayColor = aiReading?.color;
  const displayFocus = aiReading?.focus_area;

  const sections = [
    { title: 'Love & Relationships', icon: '♡', content: reading.love },
    { title: 'Career & Finance', icon: '◇', content: reading.career },
    { title: 'Health & Wellness', icon: '○', content: reading.wellness },
  ];

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
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-7xl block mb-4"
          >
            {sign.symbol}
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
            <span className="text-gradient-gold">{sign.name}</span>
          </h1>
          <p className="text-white-dim text-sm">{sign.dates}</p>
          <p className="text-white-dim text-xs mt-1">{today}</p>
        </motion.div>

        {/* Period tabs */}
        <div className="flex justify-center gap-4 mt-6 mb-8">
          <span className="text-xs text-gold px-3 py-1.5 rounded-full border border-gold/20 bg-gold/10">
            Daily
          </span>
          <Link href={`/horoscope/${sign.slug}/weekly`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
            Weekly
          </Link>
          <Link href={`/horoscope/${sign.slug}/monthly`} className="text-xs text-white-dim hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20">
            Monthly
          </Link>
        </div>

        {/* Sign details */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex justify-center gap-6 mb-12 text-xs text-white-dim"
        >
          <span>{sign.element} Sign</span>
          <span>·</span>
          <span>{sign.modality}</span>
          <span>·</span>
          <span>Ruled by {sign.ruler}</span>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-6 flex justify-around mb-8"
        >
          <div className="text-center">
            <p className="text-xs text-white-dim mb-1">Mood</p>
            <p className="text-sm font-medium text-gold">{displayMood}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-xs text-white-dim mb-1">Lucky Number</p>
            <p className="text-sm font-medium text-gold">{displayLucky}</p>
          </div>
          <div className="w-px bg-white/10" />
          {displayColor ? (
            <div className="text-center">
              <p className="text-xs text-white-dim mb-1">Color</p>
              <p className="text-sm font-medium text-gold">{displayColor}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-white-dim mb-1">Traits</p>
              <p className="text-sm font-medium text-gold">{sign.traits[0]}</p>
            </div>
          )}
          {displayFocus && (
            <>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-xs text-white-dim mb-1">Focus</p>
                <p className="text-sm font-medium text-gold capitalize">{displayFocus}</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Overall reading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card p-8 md:p-10 mb-6"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-4">Today&apos;s Reading</h2>
          <p className="text-white-muted leading-relaxed font-light text-[15px]">{displayReading}</p>
          {aiReading && (
            <p className="text-[10px] text-gold/30 mt-4">✦ AI-generated based on today&apos;s planetary transits</p>
          )}
        </motion.div>

        {/* Section readings */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-gold/60 text-lg">{section.icon}</span>
                <h3 className="text-sm font-medium">{section.title}</h3>
              </div>
              <p className="text-white-muted text-sm leading-relaxed font-light">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12 space-y-4"
        >
          <Link
            href="/birth-chart"
            className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full text-sm hover:bg-gold-light transition-all duration-300"
          >
            Get Your Full Birth Chart Reading
          </Link>
          <p className="text-[11px] text-white-dim">
            Personalized AI reading based on your exact birth data
          </p>
        </motion.div>

        {/* Navigation between signs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex justify-between items-center mt-16 pt-8 border-t border-white/5"
        >
          <Link
            href={`/horoscope/${prev.slug}`}
            className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors"
          >
            <span>←</span>
            <span>
              {prev.symbol} {prev.name}
            </span>
          </Link>
          <Link
            href={`/horoscope/${next.slug}`}
            className="flex items-center gap-2 text-sm text-white-muted hover:text-white transition-colors"
          >
            <span>
              {next.name} {next.symbol}
            </span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
