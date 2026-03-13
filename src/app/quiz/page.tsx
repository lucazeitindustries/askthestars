'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetaPixel, { trackEvent } from '@/components/MetaPixel';
import FloatingIllustration from '@/components/FloatingIllustration';

type FocusArea = 'love' | 'career' | 'growth';

interface QuizState {
  focusArea: FocusArea | null;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  birthTime: string;
  showBirthTime: boolean;
  email: string;
  sign: string;
  element: string;
  teaser: string;
  fullReading: string;
  loading: boolean;
  error: string;
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const FOCUS_OPTIONS: { key: FocusArea; label: string; sub: string }[] = [
  { key: 'love', label: 'Love & Relationships', sub: 'Romance, soulmates & connection' },
  { key: 'career', label: 'Career & Money', sub: 'Success, abundance & purpose' },
  { key: 'growth', label: 'Personal Growth', sub: 'Self-discovery & transformation' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [utm, setUtm] = useState<UTMParams>({});
  const [showPricing, setShowPricing] = useState(false);
  const [state, setState] = useState<QuizState>({
    focusArea: null,
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    birthTime: '',
    showBirthTime: false,
    email: '',
    sign: '',
    element: '',
    teaser: '',
    fullReading: '',
    loading: false,
    error: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmData: UTMParams = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
      const val = params.get(key);
      if (val) utmData[key] = val;
    }
    setUtm(utmData);
  }, []);

  const goForward = useCallback((nextStep: number) => {
    setDirection(1);
    setStep(nextStep);
  }, []);

  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  }, [step]);

  const handleFocusSelect = (area: FocusArea) => {
    setState((s) => ({ ...s, focusArea: area }));
    trackEvent('ViewContent', { content_name: area });
    goForward(2);
  };

  const handleBirthSubmit = async () => {
    const { birthMonth, birthDay, birthYear } = state;
    if (!birthMonth || !birthDay || !birthYear) {
      setState((s) => ({ ...s, error: 'Please enter your birth date' }));
      return;
    }
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);
    const y = parseInt(birthYear);
    if (y < 1920 || y > 2012 || d < 1 || d > 31 || m < 1 || m > 12) {
      setState((s) => ({ ...s, error: 'Please enter a valid birth date' }));
      return;
    }

    setState((s) => ({ ...s, error: '', loading: true }));
    trackEvent('Lead');
    goForward(3);

    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    try {
      const chartRes = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          time: state.birthTime || undefined,
        }),
      });
      const chart = await chartRes.json();
      const sign = chart.sun || 'Aries';

      const readingRes = await fetch('/api/quiz/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign,
          focusArea: state.focusArea,
          birthDate: dateStr,
        }),
      });
      const reading = await readingRes.json();

      setState((s) => ({
        ...s,
        sign: reading.sign || sign,
        element: reading.element || 'Fire',
        teaser: reading.teaser || '',
        fullReading: reading.fullReading || '',
        loading: false,
      }));
    } catch {
      setState((s) => ({
        ...s,
        sign: 'Aries',
        element: 'Fire',
        teaser: 'The stars have an important message for you. Your cosmic alignment suggests a period of significant change and opportunity ahead.',
        fullReading: 'The current planetary transits are creating powerful shifts in your chart...',
        loading: false,
      }));
    }
  };

  const handleEmailSubmit = async () => {
    const { email, birthMonth, birthDay, birthYear, birthTime } = state;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState((s) => ({ ...s, error: 'Please enter a valid email' }));
      return;
    }

    setState((s) => ({ ...s, error: '', loading: true }));
    const dateStr = `${birthYear}-${String(parseInt(birthMonth)).padStart(2, '0')}-${String(parseInt(birthDay)).padStart(2, '0')}`;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          birthDate: dateStr,
          birthTime: birthTime || undefined,
          ...utm,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setState((s) => ({ ...s, error: data.error, loading: false }));
        return;
      }
      trackEvent('CompleteRegistration');
      setState((s) => ({ ...s, loading: false }));
      goForward(5);
    } catch {
      setState((s) => ({ ...s, error: 'Something went wrong. Please try again.', loading: false }));
    }
  };

  const handleCheckout = async (plan: 'star' | 'cosmic') => {
    trackEvent('InitiateCheckout', { content_name: plan, value: plan === 'star' ? 9.99 : 19.99, currency: 'USD' });
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          email: state.email,
          successUrl: `${window.location.origin}/quiz/success`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setState((s) => ({ ...s, error: data.error || 'Checkout unavailable', loading: false }));
      }
    } catch {
      setState((s) => ({ ...s, error: 'Unable to start checkout. Please try again.', loading: false }));
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 93 }, (_, i) => 2012 - i);

  return (
    <div className="min-h-dvh flex flex-col items-center bg-black overflow-hidden">
      <MetaPixel />

      {/* Logo */}
      <div className="pt-4 pb-2 text-center z-10">
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-heading">askthestars.ai</span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 py-3 z-10">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: s === step ? 20 : 6,
              background: s <= step ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      {/* Step container */}
      <div className="flex-1 w-full max-w-[480px] px-5 relative">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-10"
              >
                <FloatingIllustration
                  src="/illustrations/hero-eclipse.png"
                  alt="Celestial eclipse"
                  width={120}
                  height={120}
                  opacity={0.5}
                  className="mb-6"
                />
                <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-heading font-light leading-tight mb-3 text-white/90">
                  What do the stars have in store for you?
                </h1>
                <p className="text-white/40 text-sm">Choose what matters most right now</p>
              </motion.div>

              <div className="w-full space-y-3">
                {FOCUS_OPTIONS.map((opt, i) => (
                  <motion.button
                    key={opt.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    onClick={() => handleFocusSelect(opt.key)}
                    className="w-full p-5 flex items-center gap-4 text-left group cursor-pointer
                               border border-white/10 hover:border-gold/30 active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="text-white/80 text-[1rem] group-hover:text-gold transition-colors">
                        {opt.label}
                      </div>
                      <div className="text-white/30 text-sm mt-0.5">{opt.sub}</div>
                    </div>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-8"
              >
                <FloatingIllustration
                  src="/illustrations/moon-phases.png"
                  alt="Moon phases"
                  width={240}
                  height={80}
                  opacity={0.4}
                  className="mb-6"
                />
                <h1 className="text-[clamp(1.75rem,5vw,2.25rem)] font-heading font-light leading-tight mb-3 text-white/90">
                  When were you born?
                </h1>
                <p className="text-white/40 text-sm">Your birth date reveals your cosmic blueprint</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full space-y-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={state.birthMonth}
                    onChange={(e) => setState((s) => ({ ...s, birthMonth: e.target.value, error: '' }))}
                    className="!border !border-white/10 !rounded-none !border-b-white/15 !px-3 !py-3"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1)}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={state.birthDay}
                    onChange={(e) => setState((s) => ({ ...s, birthDay: e.target.value, error: '' }))}
                    className="!border !border-white/10 !rounded-none !border-b-white/15 !px-3 !py-3"
                  >
                    <option value="">Day</option>
                    {days.map((d) => (
                      <option key={d} value={String(d)}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={state.birthYear}
                    onChange={(e) => setState((s) => ({ ...s, birthYear: e.target.value, error: '' }))}
                    className="!border !border-white/10 !rounded-none !border-b-white/15 !px-3 !py-3"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setState((s) => ({ ...s, showBirthTime: !s.showBirthTime }))}
                  className="text-gold/60 text-sm flex items-center gap-2 mx-auto cursor-pointer hover:text-gold transition-colors"
                >
                  <span>{state.showBirthTime ? '−' : '+'}</span>
                  Add birth time for a more accurate reading
                </button>

                {state.showBirthTime && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="time"
                      value={state.birthTime}
                      onChange={(e) => setState((s) => ({ ...s, birthTime: e.target.value }))}
                      className="w-full [color-scheme:dark]"
                      placeholder="Birth time"
                    />
                  </motion.div>
                )}

                {state.error && (
                  <p className="text-red-400/80 text-sm text-center">{state.error}</p>
                )}

                <button
                  onClick={handleBirthSubmit}
                  className="w-full btn-primary py-4 text-[1rem] cursor-pointer"
                >
                  Reveal My Reading
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {state.loading ? (
                <LoadingAnimation />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full"
                >
                  <div className="text-center mb-8">
                    <FloatingIllustration
                      src={`/illustrations/zodiac-${state.sign.toLowerCase()}.png`}
                      alt={`${state.sign} zodiac illustration`}
                      width={140}
                      height={140}
                      opacity={0.6}
                      className="mb-4"
                    />
                    <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-heading font-light text-white/90">
                      Your stars have spoken
                    </h2>
                    <p className="text-white/30 text-sm mt-1">
                      {state.sign} · {state.element} Sign
                    </p>
                  </div>

                  {/* Teaser reading */}
                  <div className="glass-card p-6 mb-4">
                    <p className="text-white/70 leading-relaxed text-[0.95rem] font-light">
                      {state.teaser}
                    </p>
                  </div>

                  {/* Blurred preview */}
                  <div className="relative glass-card p-6 mb-8">
                    <p className="text-white/70 leading-relaxed text-[0.95rem] blur-[6px] select-none" aria-hidden>
                      The coming weeks bring extraordinary planetary alignments that directly impact your path.
                      A rare conjunction between Venus and Jupiter in your fifth house creates an opening for
                      profound connection and creative breakthrough. Meanwhile, Saturn&apos;s transit through your
                      tenth house suggests that career ambitions...
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border border-white/10 px-4 py-2 flex items-center gap-2 bg-black/50">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-white/50 text-sm">Full reading locked</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => goForward(4)}
                    className="w-full btn-primary py-4 text-[1rem] cursor-pointer"
                  >
                    Unlock Your Full Reading
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-8"
              >
                <FloatingIllustration
                  src="/illustrations/stella-chat-illustration.png"
                  alt="Cosmic eye"
                  width={120}
                  height={120}
                  opacity={0.5}
                  className="mb-6"
                />
                <h1 className="text-[clamp(1.5rem,4.5vw,2rem)] font-heading font-light leading-tight mb-2 text-white/90">
                  Where should we send your daily readings?
                </h1>
                <p className="text-white/30 text-sm">Plus a personalized daily horoscope every morning</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full space-y-4"
              >
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState((s) => ({ ...s, email: e.target.value, error: '' }))}
                  placeholder="your@email.com"
                  className="w-full text-center text-lg"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                />

                {state.error && (
                  <p className="text-red-400/80 text-sm text-center">{state.error}</p>
                )}

                <button
                  onClick={handleEmailSubmit}
                  disabled={state.loading}
                  className="w-full btn-primary py-4 text-[1rem] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.loading ? 'Creating your account...' : 'Get My Free Reading'}
                </button>

                <p className="text-white/20 text-xs text-center">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </motion.div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center py-8 min-h-[calc(100dvh-100px)]"
            >
              <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-center mb-6"
              >
                <FloatingIllustration
                  src={`/illustrations/zodiac-${state.sign.toLowerCase()}.png`}
                  alt={`${state.sign} zodiac illustration`}
                  width={100}
                  height={100}
                  opacity={0.5}
                  className="mb-3"
                />
                <h2 className="text-[clamp(1.25rem,4vw,1.75rem)] font-heading font-light text-white/90">
                  Your {state.sign} Reading
                </h2>
              </motion.div>

              {/* Full reading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="glass-card p-6 mb-6 w-full"
              >
                {state.fullReading.split('\n\n').map((para, i) => (
                  <p key={i} className="text-white/70 leading-relaxed text-[0.95rem] font-light mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </motion.div>

              {/* Locked sections */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full space-y-2 mb-6"
              >
                <p className="text-white/30 text-sm text-center mb-3">Unlock your complete cosmic profile:</p>
                {[
                  'Detailed Love Forecast',
                  'Career Opportunities This Month',
                  'Your Hidden Strengths',
                  'Compatibility with Every Sign',
                  'Unlimited AI Chat with Stella',
                ].map((item, i) => (
                  <div key={i} className="py-3 px-4 flex items-center gap-3 border border-white/5 opacity-60">
                    <span className="text-white/20">🔒</span>
                    <span className="text-white/40 text-sm">{item}</span>
                  </div>
                ))}
              </motion.div>

              {/* Pricing CTA */}
              {!showPricing ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  onClick={() => setShowPricing(true)}
                  className="w-full btn-primary py-4 text-[1rem] cursor-pointer"
                >
                  Unlock Everything
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full space-y-3"
                >
                  {/* Star plan */}
                  <div className="p-5 relative border border-white/15 hover:border-gold/30 transition-all">
                    <p className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-gold text-[9px] uppercase tracking-[0.15em] bg-black px-2">
                      Most Popular
                    </p>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-white/80 text-base font-heading">Star</span>
                      <div>
                        <span className="text-white/90 text-xl font-heading font-light">$9.99</span>
                        <span className="text-white/30 text-sm">/mo</span>
                      </div>
                    </div>
                    <ul className="text-white/40 text-sm space-y-1.5 mb-4">
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Unlimited AI chat with Stella</li>
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Personalized daily readings</li>
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Full birth chart analysis</li>
                    </ul>
                    <button
                      onClick={() => handleCheckout('star')}
                      disabled={state.loading}
                      className="w-full btn-primary py-3 cursor-pointer disabled:opacity-50"
                    >
                      Subscribe
                    </button>
                  </div>

                  {/* Cosmic plan */}
                  <div className="p-5 border border-white/[0.08] hover:border-white/15 transition-all">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-white/80 text-base font-heading">Cosmic</span>
                      <div>
                        <span className="text-white/90 text-xl font-heading font-light">$19.99</span>
                        <span className="text-white/30 text-sm">/mo</span>
                      </div>
                    </div>
                    <ul className="text-white/40 text-sm space-y-1.5 mb-4">
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Everything in Star</li>
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Relationship & compatibility readings</li>
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Career guidance & forecasts</li>
                      <li className="flex items-center gap-2"><span className="text-white/20">✓</span> Monthly cosmic forecast</li>
                    </ul>
                    <button
                      onClick={() => handleCheckout('cosmic')}
                      disabled={state.loading}
                      className="w-full btn-ghost py-3 cursor-pointer disabled:opacity-50"
                    >
                      Subscribe
                    </button>
                  </div>

                  {state.error && (
                    <p className="text-red-400/80 text-sm text-center">{state.error}</p>
                  )}
                </motion.div>
              )}

              <p className="text-white/20 text-xs text-center mt-4">
                Cancel anytime. Secure payment via Stripe.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ======= Loading Animation (Step 3) ======= */
function LoadingAnimation() {
  const [dots, setDots] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const pts: { x: number; y: number; delay: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 50 + Math.random() * 30;
      pts.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        delay: i * 0.08,
      });
    }
    setDots(pts);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative w-40 h-40 mb-8">
        {/* Central dot */}
        <motion.div
          className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white/40"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Constellation dots */}
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: dot.x,
              y: dot.y,
              opacity: [0, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              delay: dot.delay,
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Subtle ring */}
        <motion.div
          className="absolute inset-4 rounded-full border border-white/[0.06]"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.p
        className="text-white/40 text-sm font-light"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Your stars are aligning...
      </motion.p>
    </motion.div>
  );
}

/* ======= Sign Emoji Helper ======= */
function getSignEmoji(sign: string): string {
  const map: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };
  return map[sign] || '✦';
}
