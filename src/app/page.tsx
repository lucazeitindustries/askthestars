'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', slug: 'aries' },
  { name: 'Taurus', symbol: '♉', slug: 'taurus' },
  { name: 'Gemini', symbol: '♊', slug: 'gemini' },
  { name: 'Cancer', symbol: '♋', slug: 'cancer' },
  { name: 'Leo', symbol: '♌', slug: 'leo' },
  { name: 'Virgo', symbol: '♍', slug: 'virgo' },
  { name: 'Libra', symbol: '♎', slug: 'libra' },
  { name: 'Scorpio', symbol: '♏', slug: 'scorpio' },
  { name: 'Sagittarius', symbol: '♐', slug: 'sagittarius' },
  { name: 'Capricorn', symbol: '♑', slug: 'capricorn' },
  { name: 'Aquarius', symbol: '♒', slug: 'aquarius' },
  { name: 'Pisces', symbol: '♓', slug: 'pisces' },
];

const features = [
  {
    icon: '◎',
    title: 'Birth Chart',
    description: 'Your unique cosmic blueprint, calculated from the exact position of the planets at your moment of birth.',
    href: '/birth-chart',
  },
  {
    icon: '✧',
    title: 'AI Astrologer',
    description: 'Ask Stella anything. Ancient wisdom meets your personal chart for tailored cosmic guidance.',
    href: '/chat',
  },
  {
    icon: '⚯',
    title: 'Compatibility',
    description: 'Explore the cosmic chemistry between any two signs. Synastry analysis powered by real planetary data.',
    href: '/compatibility',
  },
];

interface DailyReading {
  reading: string;
  mood: string;
  lucky_number: number;
}

export default function Home() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [loadingReading, setLoadingReading] = useState(false);

  const handleSignClick = async (slug: string) => {
    if (selectedSign === slug) {
      setSelectedSign(null);
      setReading(null);
      return;
    }
    setSelectedSign(slug);
    setReading(null);
    setLoadingReading(true);

    try {
      const res = await fetch(`/api/horoscope/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setReading(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingReading(false);
    }
  };

  const selectedSignData = zodiacSigns.find((s) => s.slug === selectedSign);

  return (
    <div className="min-h-screen">
      {/* Hero — Minimal. Planetarium entrance. */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.06)_0%,transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative z-10 content-narrow"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-hero mb-6"
          >
            <span className="text-gradient-gold">Ask the Stars</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-secondary text-body max-w-md mx-auto mb-12"
          >
            Your personal cosmic guide, drawn from the actual positions of the planets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <a
              href="#signs"
              className="inline-block px-8 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow"
              data-sound="click"
            >
              What&apos;s your sign?
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Zodiac Signs — Click to reveal daily reading inline */}
      <section id="signs" className="relative px-6 py-24">
        <div className="content-narrow">
          <ScrollReveal>
            <p className="text-center text-tertiary text-xs uppercase tracking-[0.3em] mb-16">
              Choose your sign
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {zodiacSigns.map((sign, i) => (
              <ScrollReveal key={sign.slug} delay={i * 0.04}>
                <button
                  onClick={() => handleSignClick(sign.slug)}
                  className={`zodiac-glow flex flex-col items-center justify-center p-4 rounded-2xl aspect-square transition-all duration-300 cursor-pointer w-full ${
                    selectedSign === sign.slug
                      ? 'bg-gold/10 border border-gold/30'
                      : 'glass-card'
                  }`}
                  data-sound="hover"
                >
                  <span className={`text-2xl sm:text-3xl mb-1.5 ${selectedSign === sign.slug ? 'zodiac-breathe' : ''}`}>
                    {sign.symbol}
                  </span>
                  <span className={`text-[10px] sm:text-xs tracking-wide ${selectedSign === sign.slug ? 'text-gold' : 'text-secondary'}`}>
                    {sign.name}
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Inline daily reading tray */}
          <AnimatePresence mode="wait">
            {selectedSign && selectedSignData && (
              <motion.div
                key={selectedSign}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="glass-card p-8 border border-gold/10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl zodiac-breathe">{selectedSignData.symbol}</span>
                    <div>
                      <h3 className="text-sm font-medium text-primary">{selectedSignData.name}</h3>
                      <p className="text-[10px] text-tertiary">Today&apos;s Reading</p>
                    </div>
                  </div>

                  {loadingReading ? (
                    <div className="space-y-3">
                      <div className="skeleton h-4 w-full" />
                      <div className="skeleton h-4 w-4/5" />
                      <div className="skeleton h-4 w-3/5" />
                    </div>
                  ) : reading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-secondary text-sm leading-relaxed font-light mb-4">
                        {reading.reading}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-tertiary">
                        <span>Mood: <span className="text-gold">{reading.mood}</span></span>
                        <span>Lucky #: <span className="text-gold">{reading.lucky_number}</span></span>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-tertiary text-sm font-light">The stars are being consulted...</p>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/5">
                    <Link
                      href={`/horoscope/${selectedSign}`}
                      className="text-xs text-gold hover:text-gold-light transition-colors"
                    >
                      Full reading →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features — Fade in one by one on scroll */}
      <section className="relative px-6 py-24">
        <div className="content-narrow">
          <ScrollReveal>
            <p className="text-center text-tertiary text-xs uppercase tracking-[0.3em] mb-4">
              What we offer
            </p>
            <h2 className="text-section text-center mb-16">
              The cosmos, decoded
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.12}>
                <Link href={feature.href} className="glass-card block p-8 group transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <span className="text-2xl text-gold/60 group-hover:text-gold transition-colors shrink-0 mt-0.5">
                      {feature.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-medium mb-2 group-hover:text-gold transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-secondary leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Minimal */}
      <section className="relative px-6 py-32 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.04)_0%,transparent_50%)]" />
        <ScrollReveal className="relative z-10 content-narrow">
          <h2 className="text-section mb-6">
            Discover your
            <br />
            <span className="text-gradient-gold">cosmic blueprint</span>
          </h2>
          <p className="text-secondary text-body mb-10">
            Enter your birth details for a personalized AI reading.
          </p>
          <Link
            href="/birth-chart"
            className="inline-block px-10 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow"
          >
            Start Your Free Reading
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
