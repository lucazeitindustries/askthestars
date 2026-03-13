'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { zodiacSigns } from '@/lib/zodiac';
import CountUp from '@/components/CountUp';
import SparkleEffect from '@/components/SparkleEffect';

interface CompatResult {
  score: number;
  spark: string;
  friction: string;
  emotional: string;
  chemistry: string;
  longterm: string;
  advice: string;
}

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [result, setResult] = useState<CompatResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);

  const handleCheck = async () => {
    if (!sign1 || !sign2) return;

    // Easter egg: same sign
    if (sign1 === sign2) {
      setEasterEgg(true);
    } else {
      setEasterEgg(false);
    }

    setLoading(true);
    setResult(null);
    setVisibleSections(0);
    setShowSparkle(false);

    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign1, sign2 }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);

      // Staggered reveal
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleSections(count);
        if (count >= 7) clearInterval(interval);
      }, 350);

      // Sparkle if high score
      if (data.score > 75) {
        setTimeout(() => setShowSparkle(true), 1200);
      }
    } catch (error) {
      console.error('Compatibility error:', error);
      const s1 = zodiacSigns.find((s) => s.slug === sign1);
      const s2 = zodiacSigns.find((s) => s.slug === sign2);
      if (s1 && s2) {
        const sameElement = s1.element === s2.element;
        const compatElements: Record<string, string[]> = {
          Fire: ['Air', 'Fire'], Air: ['Fire', 'Air'],
          Earth: ['Water', 'Earth'], Water: ['Earth', 'Water'],
        };
        const elementCompat = compatElements[s1.element]?.includes(s2.element);
        const fallback = {
          score: sameElement ? 85 : elementCompat ? 72 : 58,
          spark: `${s1.name} and ${s2.name} share an intriguing cosmic connection.`,
          friction: 'Every pairing has growth edges — these challenges become your greatest strengths.',
          emotional: 'Your emotional styles differ, offering rich opportunities to learn from each other.',
          chemistry: 'The attraction between these signs has a magnetic quality worth exploring.',
          longterm: 'With awareness and communication, this pairing has real potential.',
          advice: 'Focus on understanding rather than changing each other.',
        };
        setResult(fallback);
        let count = 0;
        const interval = setInterval(() => {
          count++;
          setVisibleSections(count);
          if (count >= 7) clearInterval(interval);
        }, 350);
        if (fallback.score > 75) {
          setTimeout(() => setShowSparkle(true), 1200);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when sign2 is selected
  useEffect(() => {
    if (sign1 && sign2) {
      handleCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign2]);

  const s1Data = zodiacSigns.find((s) => s.slug === sign1);
  const s2Data = zodiacSigns.find((s) => s.slug === sign2);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="content-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-section mb-4">
            <span className="text-gradient-gold">Compatibility</span>
          </h1>
          <p className="text-secondary text-body">
            Discover the cosmic chemistry between two signs.
          </p>
        </motion.div>

        {/* Step 1: Select YOUR sign */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card p-8 mb-4"
        >
          <label className="block text-xs uppercase tracking-widest text-tertiary mb-4 text-center">
            {!sign1 ? 'Select your sign' : 'Your sign'}
          </label>
          <div className="grid grid-cols-6 gap-2">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.slug}
                type="button"
                onClick={() => {
                  setSign1(sign.slug);
                  setSign2('');
                  setResult(null);
                  setVisibleSections(0);
                  setEasterEgg(false);
                }}
                className={`zodiac-glow p-2.5 rounded-lg text-center transition-all duration-200 ${
                  sign1 === sign.slug
                    ? 'bg-gold/15 border border-gold/30 text-gold'
                    : 'bg-white/[0.02] border border-white/5 text-tertiary hover:border-white/10 hover:text-white'
                }`}
              >
                <span className={`text-xl block ${sign1 === sign.slug ? 'zodiac-breathe' : ''}`}>{sign.symbol}</span>
                <span className="text-[9px] block mt-0.5">{sign.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Select THEIR sign — only appears after step 1 */}
        <AnimatePresence>
          {sign1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="glass-card p-8 mb-4">
                <label className="block text-xs uppercase tracking-widest text-tertiary mb-4 text-center">
                  Now select theirs
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {zodiacSigns.map((sign) => (
                    <button
                      key={sign.slug}
                      type="button"
                      onClick={() => setSign2(sign.slug)}
                      className={`zodiac-glow p-2.5 rounded-lg text-center transition-all duration-200 ${
                        sign2 === sign.slug
                          ? 'bg-gold/15 border border-gold/30 text-gold'
                          : 'bg-white/[0.02] border border-white/5 text-tertiary hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <span className={`text-xl block ${sign2 === sign.slug ? 'zodiac-breathe' : ''}`}>{sign.symbol}</span>
                      <span className="text-[9px] block mt-0.5">{sign.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-10 text-center"
          >
            <motion.div
              className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm text-tertiary mt-4">Reading the stars...</p>
            <div className="mt-6 space-y-3 max-w-xs mx-auto">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-4 w-3/5" />
            </div>
          </motion.div>
        )}

        {/* Easter egg */}
        <AnimatePresence>
          {easterEgg && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 mb-6 border border-gold/20 text-center"
            >
              <p className="text-gold text-sm">✦ Checking compatibility with yourself? Cosmic narcissist energy. ✦</p>
              <p className="text-[11px] text-tertiary mt-2">We respect the self-love, though.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && s1Data && s2Data && !loading && (
            <motion.div
              key={`${sign1}-${sign2}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Score — section 1 */}
              {visibleSections >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 md:p-10 text-center"
                >
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="text-center">
                      <span className="text-4xl zodiac-breathe inline-block">{s1Data.symbol}</span>
                      <p className="text-sm text-secondary mt-1">{s1Data.name}</p>
                    </div>
                    <div className="text-gold/30 text-2xl">×</div>
                    <div className="text-center">
                      <span className="text-4xl zodiac-breathe inline-block">{s2Data.symbol}</span>
                      <p className="text-sm text-secondary mt-1">{s2Data.name}</p>
                    </div>
                  </div>

                  {/* Score ring with count-up */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                      <motion.circle
                        cx="60" cy="60" r="52" fill="none" stroke="url(#goldGrad)" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - result.score / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      />
                      <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#d4a853" />
                          <stop offset="100%" stopColor="#e8c97a" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CountUp
                        value={result.score}
                        duration={1.5}
                        delay={0.3}
                        className="text-3xl font-light text-gradient-gold"
                      />
                    </div>
                    {/* Sparkle burst for high scores */}
                    <SparkleEffect trigger={showSparkle} count={24} />
                  </div>
                </motion.div>
              )}

              {/* Detail sections — staggered */}
              {[
                { title: 'The Spark', icon: '✦', content: result.spark, section: 2 },
                { title: 'The Friction', icon: '◇', content: result.friction, section: 3 },
                { title: 'Emotional Connection', icon: '♡', content: result.emotional, section: 4 },
                { title: 'Chemistry', icon: '⚡', content: result.chemistry, section: 5 },
                { title: 'Long-term Potential', icon: '∞', content: result.longterm, section: 6 },
              ].map((s) => (
                visibleSections >= s.section && (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gold/60">{s.icon}</span>
                      <h3 className="text-sm font-medium">{s.title}</h3>
                    </div>
                    <p className="text-secondary text-sm leading-relaxed font-light">{s.content}</p>
                  </motion.div>
                )
              ))}

              {/* Advice — section 7 */}
              {visibleSections >= 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-8 border border-gold/10"
                >
                  <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Cosmic Advice</h3>
                  <p className="text-secondary text-sm leading-relaxed font-light">{result.advice}</p>
                </motion.div>
              )}

              {/* CTA */}
              {visibleSections >= 7 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4 pt-4"
                >
                  <p className="text-xs text-hint">
                    Want a deeper reading? Get your full birth charts analyzed together.
                  </p>
                  <Link
                    href="/birth-chart"
                    className="inline-block px-8 py-3 bg-gold/10 text-gold border border-gold/20 rounded-full text-sm hover:bg-gold/20 transition-all duration-300"
                  >
                    Get Full Synastry Reading
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
