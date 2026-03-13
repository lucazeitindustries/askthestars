'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { zodiacSigns } from '@/lib/zodiac';

interface CompatResult {
  score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

function getCompatibility(sign1: string, sign2: string): CompatResult {
  // Placeholder compatibility logic — will be AI-powered later
  const s1 = zodiacSigns.find((s) => s.slug === sign1);
  const s2 = zodiacSigns.find((s) => s.slug === sign2);
  if (!s1 || !s2) return { score: 0, summary: '', strengths: [], challenges: [], advice: '' };

  const sameElement = s1.element === s2.element;
  const compatElements: Record<string, string[]> = {
    Fire: ['Air', 'Fire'],
    Air: ['Fire', 'Air'],
    Earth: ['Water', 'Earth'],
    Water: ['Earth', 'Water'],
  };
  const elementCompat = compatElements[s1.element]?.includes(s2.element);

  const score = sameElement ? 92 : elementCompat ? 78 : 61;

  return {
    score,
    summary: sameElement
      ? `${s1.name} and ${s2.name} share the ${s1.element} element, creating a natural understanding and shared energy. You intuitively get each other — sometimes almost too well.`
      : elementCompat
      ? `${s1.name} (${s1.element}) and ${s2.name} (${s2.element}) form a complementary pairing. Your elements feed each other, creating a dynamic and growth-oriented connection.`
      : `${s1.name} and ${s2.name} are a study in contrasts. This pairing requires more conscious effort, but the tension creates attraction and the differences offer profound growth opportunities.`,
    strengths: sameElement
      ? ['Deep mutual understanding', 'Shared values and pace', 'Natural emotional resonance', 'Easy communication']
      : elementCompat
      ? ['Complementary energies', 'Mutual inspiration', 'Balanced dynamic', 'Growth-oriented bond']
      : ['Magnetic attraction', 'Learning from differences', 'Broadened perspectives', 'Transformative potential'],
    challenges: sameElement
      ? ['May lack tension to grow', 'Risk of complacency', 'Blind spots in common']
      : elementCompat
      ? ['Different communication styles', 'Pacing mismatches', 'Occasional misunderstandings']
      : ['Fundamental differences in approach', 'Requires conscious compromise', 'Potential for friction'],
    advice: sameElement
      ? 'Lean into your similarities but actively seek growth. The comfort is your strength — don\'t let it become stagnation.'
      : elementCompat
      ? 'Celebrate what each of you brings to the table. Your differences are features, not bugs. Meet in the middle on pacing.'
      : 'Patience and curiosity are your greatest allies. Approach each other as fascinating puzzles rather than problems to solve.',
  };
}

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [result, setResult] = useState<CompatResult | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (sign1 && sign2) {
      setResult(getCompatibility(sign1, sign2));
    }
  };

  const s1 = zodiacSigns.find((s) => s.slug === sign1);
  const s2 = zodiacSigns.find((s) => s.slug === sign2);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">
            Cosmic Chemistry
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            <span className="text-gradient-gold">Compatibility</span>
          </h1>
          <p className="text-white-muted font-light max-w-md mx-auto">
            Discover the cosmic chemistry between any two signs. Select yours and theirs to reveal what the stars say about your connection.
          </p>
        </motion.div>

        {/* Sign Selection */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleCheck}
          className="glass-card p-8 md:p-10 mb-8"
        >
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-end">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white-dim mb-3">
                Your Sign
              </label>
              <div className="grid grid-cols-4 gap-2">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.slug}
                    type="button"
                    onClick={() => setSign1(sign.slug)}
                    className={`p-2 rounded-lg text-center transition-all duration-200 ${
                      sign1 === sign.slug
                        ? 'bg-gold/15 border border-gold/30 text-gold'
                        : 'bg-white/3 border border-white/5 text-white-dim hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg block">{sign.symbol}</span>
                    <span className="text-[9px] block mt-0.5">{sign.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center pb-6">
              <span className="text-2xl text-gold/30">⚯</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white-dim mb-3">
                Their Sign
              </label>
              <div className="grid grid-cols-4 gap-2">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.slug}
                    type="button"
                    onClick={() => setSign2(sign.slug)}
                    className={`p-2 rounded-lg text-center transition-all duration-200 ${
                      sign2 === sign.slug
                        ? 'bg-gold/15 border border-gold/30 text-gold'
                        : 'bg-white/3 border border-white/5 text-white-dim hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg block">{sign.symbol}</span>
                    <span className="text-[9px] block mt-0.5">{sign.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!sign1 || !sign2}
            className="w-full mt-8 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 gold-glow"
          >
            Reveal Your Compatibility ✦
          </button>
        </motion.form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && s1 && s2 && (
            <motion.div
              key={`${sign1}-${sign2}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Score */}
              <div className="glass-card p-8 md:p-10 text-center">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <span className="text-4xl">{s1.symbol}</span>
                    <p className="text-sm text-white-muted mt-1">{s1.name}</p>
                  </div>
                  <div className="text-gold/30 text-2xl">×</div>
                  <div className="text-center">
                    <span className="text-4xl">{s2.symbol}</span>
                    <p className="text-sm text-white-muted mt-1">{s2.name}</p>
                  </div>
                </div>

                {/* Score ring */}
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
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-3xl font-light text-gradient-gold"
                    >
                      {result.score}%
                    </motion.span>
                  </div>
                </div>

                <p className="text-white-muted leading-relaxed font-light text-sm max-w-lg mx-auto">
                  {result.summary}
                </p>
              </div>

              {/* Strengths & Challenges */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-6">
                  <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Strengths</h3>
                  <ul className="space-y-3">
                    {result.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-sm text-white-muted font-light">
                        <span className="text-gold/50 mt-0.5 shrink-0">✦</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {result.challenges.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-sm text-white-muted font-light">
                        <span className="text-white-dim mt-0.5 shrink-0">◇</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Advice */}
              <div className="glass-card p-8">
                <h3 className="text-xs uppercase tracking-widest text-gold/60 mb-4">Cosmic Advice</h3>
                <p className="text-white-muted text-sm leading-relaxed font-light">{result.advice}</p>
              </div>

              {/* Share & CTA */}
              <div className="text-center space-y-4 pt-4">
                <p className="text-xs text-white-dim">
                  Want a deeper reading? Get your full birth charts analyzed together.
                </p>
                <Link
                  href="/birth-chart"
                  className="inline-block px-8 py-3 bg-gold/10 text-gold border border-gold/20 rounded-full text-sm hover:bg-gold/20 transition-all duration-300"
                >
                  Get Full Synastry Reading
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
