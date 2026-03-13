'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import FloatingIllustration from '@/components/FloatingIllustration';

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
    title: 'Birth Chart',
    description: 'Your unique cosmic blueprint, calculated from the exact position of the planets at your moment of birth.',
    href: '/birth-chart',
  },
  {
    title: 'AI Astrologer',
    description: 'Ask Stella anything. Ancient wisdom meets your personal chart for tailored cosmic guidance.',
    href: '/chat',
  },
  {
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
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative z-10 content-narrow"
        >
          <FloatingIllustration
            src="/illustrations/hero-eclipse.png"
            alt="Celestial eclipse illustration"
            width={300}
            height={300}
            opacity={0.7}
            blendMode="screen"
            className="mb-8"
          />

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="text-hero mb-8 text-white/90"
          >
            Ask the Stars
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-white/50 text-body max-w-md mx-auto mb-14"
          >
            Your personal cosmic guide, drawn from the actual positions of the planets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <a
              href="#signs"
              className="btn-ghost inline-block"
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
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* Zodiac Signs */}
      <section id="signs" className="relative px-6 py-32 md:py-40">
        <div className="content-narrow">
          <ScrollReveal>
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] mb-16">
              Choose your sign
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {zodiacSigns.map((sign, i) => (
              <ScrollReveal key={sign.slug} delay={i * 0.03}>
                <button
                  onClick={() => handleSignClick(sign.slug)}
                  className={`zodiac-glow flex flex-col items-center justify-center p-4 aspect-square transition-all duration-300 cursor-pointer w-full rounded-lg ${
                    selectedSign === sign.slug
                      ? 'border border-gold/30 bg-white/[0.03]'
                      : 'border border-transparent hover:border-white/10'
                  }`}
                >
                  <span className={`text-2xl sm:text-3xl mb-1.5 ${selectedSign === sign.slug ? 'text-gold' : 'text-white/60'}`}>
                    {sign.symbol}
                  </span>
                  <span className={`text-[10px] sm:text-xs tracking-wide ${selectedSign === sign.slug ? 'text-gold' : 'text-white/40'}`}>
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
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{selectedSignData.symbol}</span>
                    <div>
                      <h3 className="text-sm text-white/90">{selectedSignData.name}</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Today&apos;s Reading</p>
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
                      <p className="text-white/70 text-sm leading-relaxed font-light mb-4">
                        {reading.reading}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-white/30">
                        <span>Mood: <span className="text-white/50">{reading.mood}</span></span>
                        <span>Lucky #: <span className="text-white/50">{reading.lucky_number}</span></span>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-white/30 text-sm font-light">The stars are being consulted...</p>
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

      {/* Moon phases divider */}
      <div className="relative px-6 py-8 flex justify-center">
        <FloatingIllustration
          src="/illustrations/moon-phases.png"
          alt="Moon phases divider"
          width={800}
          height={100}
          opacity={0.45}
          className="w-full max-w-3xl"
        />
      </div>

      {/* Features — text only, no cards */}
      <section className="relative px-6 py-32 md:py-40">
        <div className="content-narrow">
          <ScrollReveal>
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.3em] mb-4">
              What we offer
            </p>
            <h2 className="text-section text-center text-white/90 mb-20">
              The cosmos, decoded
            </h2>
          </ScrollReveal>

          <div className="space-y-16">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <Link href={feature.href} className="block group">
                  <h3 className="text-base font-heading tracking-wide mb-3 text-white/70 group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light max-w-lg">
                    {feature.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32 md:py-40 text-center">
        <ScrollReveal className="relative z-10 content-narrow">
          <h2 className="text-section text-white/90 mb-6">
            Discover your cosmic blueprint
          </h2>
          <p className="text-white/50 text-body mb-12">
            Enter your birth details for a personalized AI reading.
          </p>
          <Link
            href="/birth-chart"
            className="btn-ghost inline-block"
          >
            Start Your Free Reading
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
