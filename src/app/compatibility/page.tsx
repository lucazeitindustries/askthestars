'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { zodiacSigns } from '@/lib/zodiac';
import CountUp from '@/components/CountUp';
import SparkleEffect from '@/components/SparkleEffect';
import FloatingIllustration from '@/components/FloatingIllustration';

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

      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleSections(count);
        if (count >= 7) clearInterval(interval);
      }, 350);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <FloatingIllustration
            src="/illustrations/compatibility-illustration.png"
            alt="Compatibility zodiac illustration"
            width={200}
            height={200}
            opacity={0.7}
            className="mb-6"
          />
          <h1 className="text-section mb-4 text-white/90">
            Compatibility
          </h1>
          <p className="text-white/50 text-body">
            Discover the cosmic chemistry between two signs.
          </p>
        </motion.div>

        {/* Step 1: Select YOUR sign */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
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
                className={`zodiac-glow p-2.5 text-center transition-all duration-200 cursor-pointer ${
                  sign1 === sign.slug
                    ? 'border border-gold/30 text-gold'
                    : 'border border-transparent text-white/40 hover:text-white/60 hover:border-white/10'
                }`}
              >
                <span className="text-xl block">{sign.symbol}</span>
                <span className="text-[9px] block mt-0.5">{sign.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Select THEIR sign */}
        <AnimatePresence>
          {sign1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden mb-12"
            >
              <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6 text-center">
                Now select theirs
              </label>
              <div className="grid grid-cols-6 gap-2">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.slug}
                    type="button"
                    onClick={() => setSign2(sign.slug)}
                    className={`zodiac-glow p-2.5 text-center transition-all duration-200 cursor-pointer ${
                      sign2 === sign.slug
                        ? 'border border-gold/30 text-gold'
                        : 'border border-transparent text-white/40 hover:text-white/60 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl block">{sign.symbol}</span>
                    <span className="text-[9px] block mt-0.5">{sign.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-xs text-white/30 mt-4">Reading the stars...</p>
          </motion.div>
        )}

        {/* Easter egg */}
        <AnimatePresence>
          {easterEgg && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center py-4 border-t border-b border-white/5"
            >
              <p className="text-gold text-sm">✦ Checking compatibility with yourself? Cosmic narcissist energy. ✦</p>
              <p className="text-[10px] text-white/30 mt-2">We respect the self-love, though.</p>
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
              className="space-y-16"
            >
              {/* Score */}
              {visibleSections >= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="text-center">
                      <span className="text-4xl opacity-60">{s1Data.symbol}</span>
                      <p className="text-xs text-white/40 mt-1">{s1Data.name}</p>
                    </div>
                    <div className="text-white/20 text-lg">×</div>
                    <div className="text-center">
                      <span className="text-4xl opacity-60">{s2Data.symbol}</span>
                      <p className="text-xs text-white/40 mt-1">{s2Data.name}</p>
                    </div>
                  </div>

                  {/* Score ring — thinner, more elegant */}
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                      <motion.circle
                        cx="60" cy="60" r="54" fill="none" stroke="#d4a853" strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - result.score / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CountUp
                        value={result.score}
                        duration={1.5}
                        delay={0.3}
                        className="text-2xl font-heading font-light text-white/90"
                      />
                    </div>
                    <SparkleEffect trigger={showSparkle} count={12} />
                  </div>
                </motion.div>
              )}

              {/* Detail sections — whitespace separated, no cards */}
              {[
                { title: 'The Spark', content: result.spark, section: 2 },
                { title: 'The Friction', content: result.friction, section: 3 },
                { title: 'Emotional Connection', content: result.emotional, section: 4 },
                { title: 'Chemistry', content: result.chemistry, section: 5 },
                { title: 'Long-term Potential', content: result.longterm, section: 6 },
              ].map((s) => (
                visibleSections >= s.section && (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">{s.title}</p>
                    <p className="text-white/70 text-sm leading-relaxed font-light">{s.content}</p>
                  </motion.div>
                )
              ))}

              {/* Advice */}
              {visibleSections >= 7 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-white/5 pt-8"
                >
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">Cosmic Advice</p>
                  <p className="text-white/50 text-sm leading-relaxed font-light italic">{result.advice}</p>
                </motion.div>
              )}

              {/* CTA */}
              {visibleSections >= 7 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4 pt-4"
                >
                  <p className="text-[10px] text-white/20">
                    Want a deeper reading? Get your full birth charts analyzed together.
                  </p>
                  <Link href="/birth-chart" className="btn-ghost inline-block">
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
