'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ZodiacSign } from '@/lib/zodiac';
import ScrollReveal from '@/components/ScrollReveal';

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
    fetch(`/api/horoscope/${sign.slug}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.reading) setAiReading(data);
      })
      .catch(() => {});
  }, [sign.slug]);

  const displayReading = aiReading?.reading || reading.overall;
  const displayMood = aiReading?.mood || reading.mood;
  const displayLucky = aiReading?.lucky_number || reading.luckyNumber;
  const displayColor = aiReading?.color;
  const displayFocus = aiReading?.focus_area;

  const sections = [
    { label: 'Love & Relationships', content: reading.love },
    { label: 'Career & Finance', content: reading.career },
    { label: 'Health & Wellness', content: reading.wellness },
  ];

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
          <p className="text-white/30 text-xs tracking-wide">{sign.dates}</p>
          <p className="text-white/20 text-[10px] mt-1">{today}</p>
        </motion.div>

        {/* Period tabs */}
        <div className="flex justify-center gap-3 mb-10">
          <span className="text-xs text-gold px-3 py-1.5 border border-gold/20">
            Daily
          </span>
          <Link href={`/horoscope/${sign.slug}/weekly`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
            Weekly
          </Link>
          <Link href={`/horoscope/${sign.slug}/monthly`} className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/10 hover:border-white/20">
            Monthly
          </Link>
        </div>

        {/* Sign details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex justify-center gap-6 mb-16 text-[11px] text-white/30"
        >
          <span>{sign.element} Sign</span>
          <span>·</span>
          <span>{sign.modality}</span>
          <span>·</span>
          <span>Ruled by {sign.ruler}</span>
        </motion.div>

        {/* Quick stats */}
        <ScrollReveal>
          <div className="flex justify-around py-6 mb-12 border-t border-b border-white/5">
            <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Mood</p>
              <p className="text-sm text-white/70">{displayMood}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Lucky #</p>
              <p className="text-sm text-white/70">{displayLucky}</p>
            </div>
            {displayColor && (
              <div className="text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Color</p>
                <p className="text-sm text-white/70">{displayColor}</p>
              </div>
            )}
            {displayFocus && (
              <div className="text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Focus</p>
                <p className="text-sm text-white/70 capitalize">{displayFocus}</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Overall reading */}
        <ScrollReveal delay={0.1}>
          <div className="mb-20">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">Today&apos;s Reading</p>
            <p className="text-white/70 leading-relaxed font-light text-body">{displayReading}</p>
            {aiReading && (
              <p className="text-[10px] text-white/20 mt-6">✦ AI-generated based on today&apos;s planetary transits</p>
            )}
          </div>
        </ScrollReveal>

        {/* Section readings — whitespace separated, no cards */}
        <div className="space-y-16">
          {sections.map((section, i) => (
            <ScrollReveal key={section.label} delay={0.1 + i * 0.08}>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">{section.label}</p>
                <p className="text-white/70 text-sm leading-relaxed font-light">{section.content}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-20 space-y-4">
            <Link href="/birth-chart" className="btn-ghost inline-block">
              Get Your Full Birth Chart Reading
            </Link>
            <p className="text-[10px] text-white/20">
              Personalized AI reading based on your exact birth data
            </p>
          </div>
        </ScrollReveal>

        {/* Navigation between signs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-between items-center mt-20 pt-8 border-t border-white/5"
        >
          <Link
            href={`/horoscope/${prev.slug}`}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <span>←</span>
            <span>{prev.symbol} {prev.name}</span>
          </Link>
          <Link
            href={`/horoscope/${next.slug}`}
            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            <span>{next.name} {next.symbol}</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
