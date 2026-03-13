'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const zodiacSigns = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20' },
];

const features = [
  {
    icon: '◎',
    title: 'Birth Chart Analysis',
    description: 'Discover your unique cosmic blueprint based on the exact positions of the planets at your moment of birth.',
    href: '/birth-chart',
  },
  {
    icon: '☽',
    title: 'Daily Horoscopes',
    description: 'AI-generated readings for every sign, refreshed daily with current planetary transits and celestial insights.',
    href: '/horoscope/aries',
  },
  {
    icon: '✧',
    title: 'AI Astrologer Chat',
    description: 'Ask the stars anything. Our AI astrologer weaves ancient wisdom with your personal chart for tailored guidance.',
    href: '/chat',
  },
  {
    icon: '⚯',
    title: 'Compatibility',
    description: 'Explore the cosmic chemistry between you and anyone. Synastry analysis powered by AI and real planetary data.',
    href: '/compatibility',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.08)_0%,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 max-w-3xl"
        >
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-gold/70 mb-8"
          >
            AI-Powered Astrology
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-8"
          >
            <span className="text-gradient-gold">Ask the</span>
            <br />
            <span className="text-white">Stars</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-white-muted max-w-xl mx-auto mb-12 leading-relaxed font-light"
          >
            Your personal cosmic guide. AI-powered readings drawn from the actual positions of the planets — tailored to your birth chart.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/birth-chart"
              className="group relative px-8 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow"
            >
              Get Your Free Reading
            </Link>
            <Link
              href="/horoscope/aries"
              className="px-8 py-4 border border-white/10 rounded-full text-sm text-white-muted hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Read Today&apos;s Horoscope
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-32 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            The cosmos, decoded
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={feature.href} className="glass-card block p-8 md:p-10 group transition-all duration-300">
                <span className="text-2xl text-gold/70 group-hover:text-gold transition-colors">
                  {feature.icon}
                </span>
                <h3 className="text-lg font-medium mt-4 mb-3 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white-muted leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Zodiac Grid */}
      <section className="relative px-6 py-32 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">Daily Horoscopes</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            Choose your sign
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {zodiacSigns.map((sign, i) => (
            <motion.div
              key={sign.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/horoscope/${sign.name.toLowerCase()}`}
                className="glass-card flex flex-col items-center justify-center p-5 md:p-6 group transition-all duration-300 aspect-square"
              >
                <span className="text-3xl md:text-4xl mb-2 group-hover:text-gold transition-colors">
                  {sign.symbol}
                </span>
                <span className="text-xs font-medium tracking-wide group-hover:text-gold transition-colors">
                  {sign.name}
                </span>
                <span className="text-[10px] text-white-dim mt-1 hidden md:block">
                  {sign.dates}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-32 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,83,0.06)_0%,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            Ready to discover
            <br />
            <span className="text-gradient-gold">your cosmic blueprint?</span>
          </h2>
          <p className="text-white-muted mb-10 font-light">
            Enter your birth details and receive a personalized AI reading based on real planetary positions.
          </p>
          <Link
            href="/birth-chart"
            className="inline-block px-10 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow"
          >
            Start Your Free Reading
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
