'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetaPixel, { trackEvent } from '@/components/MetaPixel';
import FloatingIllustration, { cdnUrl } from '@/components/FloatingIllustration';
import PaymentForm from '@/components/PaymentForm';

// Preload quiz illustrations on module load
const PRELOAD_IMAGES = [
  '/illustrations/hero-eclipse.png',
  '/illustrations/moon-phases.png',
  '/illustrations/stella-chat-illustration.png',
].map(cdnUrl);

if (typeof window !== 'undefined') {
  PRELOAD_IMAGES.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

type FocusArea = 'love' | 'career' | 'growth';

type StepType = 'intro' | 'splash' | 'action';

interface StepConfig {
  type: StepType;
  id: string;
}

// 10-step flow: 3 intros, 5 action steps, 2 splash steps
const STEPS: StepConfig[] = [
  { type: 'intro', id: 'intro-1' },
  { type: 'intro', id: 'intro-2' },
  { type: 'intro', id: 'intro-3' },
  { type: 'action', id: 'focus' },
  { type: 'splash', id: 'splash-focus' },
  { type: 'action', id: 'birthdate' },
  { type: 'splash', id: 'splash-analyzing' },
  { type: 'action', id: 'teaser' },
  { type: 'action', id: 'email' },
  { type: 'action', id: 'reading' },
];

// Map action steps to progress dot indices (0-4)
const ACTION_STEP_INDICES = STEPS
  .map((s, i) => ({ ...s, index: i }))
  .filter((s) => s.type === 'action');

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

// Static arrays — no need to recreate every render
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 93 }, (_, i) => 2012 - i);

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    willChange: 'transform' as const,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const slideTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export default function QuizPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [utm, setUtm] = useState<UTMParams>({});
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'star' | 'cosmic' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const splashTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  const currentStep = STEPS[stepIndex];

  // Calculate which action step we're on (for progress dots)
  const currentActionIndex = (() => {
    const idx = ACTION_STEP_INDICES.findIndex((s) => s.index >= stepIndex);
    if (idx === -1) return ACTION_STEP_INDICES.length - 1;
    // If we're past an action step (on a splash after it), show the previous action as active
    const match = ACTION_STEP_INDICES[idx];
    if (match.index === stepIndex) return idx;
    return Math.max(0, idx - 1);
  })();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmData: UTMParams = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
      const val = params.get(key);
      if (val) utmData[key] = val;
    }
    setUtm(utmData);
  }, []);

  // Auto-advance for splash steps (except splash-analyzing which waits for API)
  useEffect(() => {
    if (currentStep.type === 'splash' && currentStep.id === 'splash-focus') {
      splashTimerRef.current = setTimeout(() => {
        goForward(stepIndex + 1);
      }, 2500);
      return () => {
        if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
      };
    }
  }, [stepIndex, currentStep]);

  const goForward = useCallback((nextIndex: number) => {
    setDirection(1);
    setStepIndex(nextIndex);
  }, []);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) return;

    setDirection(-1);
    // Skip splash steps when going back
    let targetIndex = stepIndex - 1;
    while (targetIndex > 0 && STEPS[targetIndex].type === 'splash') {
      targetIndex--;
    }
    setStepIndex(targetIndex);
  }, [stepIndex]);

  const skipIntros = useCallback(() => {
    // Jump to the first action step (focus selection)
    const firstAction = STEPS.findIndex((s) => s.type === 'action');
    setDirection(1);
    setStepIndex(firstAction);
  }, []);

  const handleFocusSelect = (area: FocusArea) => {
    setState((s) => ({ ...s, focusArea: area }));
    trackEvent('ViewContent', { content_name: area });
    // Go to splash-focus step
    goForward(4);
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
    // Go to splash-analyzing step
    goForward(6);

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
      // Auto-advance to teaser step
      goForward(7);
    } catch {
      setState((s) => ({
        ...s,
        sign: 'Aries',
        element: 'Fire',
        teaser: 'The stars have an important message for you. Your cosmic alignment suggests a period of significant change and opportunity ahead.',
        fullReading: 'The current planetary transits are creating powerful shifts in your chart...',
        loading: false,
      }));
      goForward(7);
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
      goForward(9);
    } catch {
      setState((s) => ({ ...s, error: 'Something went wrong. Please try again.', loading: false }));
    }
  };

  const handleSelectPlan = async (plan: 'star' | 'cosmic') => {
    trackEvent('InitiateCheckout', { content_name: plan, value: plan === 'star' ? 9.99 : 19.99, currency: 'USD' });
    setSelectedPlan(plan);
    setPaymentLoading(true);
    setClientSecret(null);
    setState((s) => ({ ...s, error: '' }));

    try {
      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: state.email }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setState((s) => ({ ...s, error: data.error || 'Unable to set up payment' }));
        setSelectedPlan(null);
      }
    } catch {
      setState((s) => ({ ...s, error: 'Unable to start checkout. Please try again.' }));
      setSelectedPlan(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    trackEvent('Purchase', {
      content_name: selectedPlan,
      value: selectedPlan === 'star' ? 9.99 : 19.99,
      currency: 'USD',
    });
    window.location.href = '/quiz/success';
  };

  const handleChangePlan = () => {
    setSelectedPlan(null);
    setClientSecret(null);
    setState((s) => ({ ...s, error: '' }));
  };

  // Count teaser insights (sentences in teaser text)
  const insightCount = state.teaser ? state.teaser.split(/[.!?]+/).filter(Boolean).length : 0;

  const showProgressDots = currentStep.type === 'action';
  const showSkipButton = currentStep.type === 'intro';
  const showBackButton = stepIndex > 0 && currentStep.type !== 'splash';

  return (
    <div className="min-h-dvh flex flex-col items-center bg-black overflow-hidden">
      <MetaPixel />

      {/* Logo */}
      <div className="pt-4 pb-2 text-center z-10">
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-heading">askthestars.ai</span>
      </div>

      {/* Progress dots — only for action steps */}
      <div className="flex gap-2 py-3 z-10" style={{ opacity: showProgressDots ? 1 : 0, transition: 'opacity 0.3s' }}>
        {ACTION_STEP_INDICES.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === currentActionIndex ? 20 : 6,
              background: i <= currentActionIndex ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      {/* Skip button for intro steps */}
      {showSkipButton && (
        <button
          onClick={skipIntros}
          className="fixed top-4 right-4 z-20 text-white/30 text-sm cursor-pointer hover:text-white/50 transition-colors"
        >
          Skip
        </button>
      )}

      {/* Step container */}
      <div className="flex-1 w-full max-w-[480px] px-5 relative">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ===== INTRO 1: Your stars. Decoded by AI. ===== */}
          {currentStep.id === 'intro-1' && (
            <motion.div
              key="intro-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <div className="text-center">
                <FloatingIllustration
                  src="/illustrations/hero-eclipse.png"
                  alt="Celestial eclipse"
                  width={140}
                  height={140}
                  opacity={0.6}
                  priority
                  className="mb-8"
                />
                <h1 className="text-[clamp(2rem,6vw,2.75rem)] font-heading font-light leading-[1.15] mb-6 text-white/90">
                  Your stars.<br />Decoded by AI.
                </h1>
                <p className="text-white/50 text-[0.95rem] leading-relaxed max-w-[340px] mx-auto font-light">
                  We combine real-time planetary data with advanced AI to give you the most accurate, personalized astrology readings available.
                </p>
                <p className="text-white/35 text-sm mt-4 italic">
                  Not generic horoscopes — readings based on YOUR exact birth chart.
                </p>
              </div>

              <button
                onClick={() => goForward(1)}
                className="mt-12 btn-ghost px-10 py-3 text-[0.95rem] cursor-pointer"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* ===== INTRO 2: What you'll get ===== */}
          {currentStep.id === 'intro-2' && (
            <motion.div
              key="intro-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center">
                <FloatingIllustration
                  src="/illustrations/moon-phases.png"
                  alt="Moon phases"
                  width={200}
                  height={70}
                  opacity={0.5}
                  className="mb-8"
                />
                <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-heading font-light leading-[1.15] mb-8 text-white/90">
                  What you&apos;ll get:
                </h1>
                <div className="text-left space-y-4 max-w-[320px] mx-auto">
                  {[
                    'Personalized daily readings based on your chart',
                    'AI that actually understands planetary transits',
                    'Compatibility analysis with real astrological data',
                    'A personal astrologer available 24/7',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <span className="text-gold/70 text-sm mt-0.5 shrink-0">✦</span>
                      <span className="text-white/55 text-[0.95rem] font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => goForward(2)}
                className="mt-12 btn-ghost px-10 py-3 text-[0.95rem] cursor-pointer"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* ===== INTRO 3: Ready in 60 seconds ===== */}
          {currentStep.id === 'intro-3' && (
            <motion.div
              key="intro-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center">
                <FloatingIllustration
                  src="/illustrations/stella-chat-illustration.png"
                  alt="Cosmic eye"
                  width={120}
                  height={120}
                  opacity={0.5}
                  className="mb-8"
                />
                <h1 className="text-[clamp(2rem,6vw,2.75rem)] font-heading font-light leading-[1.15] mb-4 text-white/90">
                  Ready in 60 seconds.
                </h1>
                <p className="text-white/45 text-[0.95rem] font-light max-w-[300px] mx-auto leading-relaxed">
                  Answer two quick questions and we&apos;ll decode your cosmic blueprint.
                </p>
              </div>

              <button
                onClick={() => goForward(3)}
                className="mt-12 btn-primary px-10 py-3.5 text-[0.95rem] cursor-pointer"
              >
                Let&apos;s go
              </button>
            </motion.div>
          )}

          {/* ===== STEP 4: Focus Selection ===== */}
          {currentStep.id === 'focus' && (
            <motion.div
              key="focus"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center mb-10">
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
              </div>

              <div className="w-full space-y-3">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
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
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== SPLASH: Great choice ===== */}
          {currentStep.id === 'splash-focus' && (
            <motion.div
              key="splash-focus"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <div className="text-center">
                <h1 className="text-[clamp(2rem,6vw,2.75rem)] font-heading font-light leading-[1.2] text-white/90 mb-3">
                  Great choice. <span className="text-gold">✦</span>
                </h1>
                <p className="text-white/40 text-[0.95rem] font-light">
                  Now let&apos;s find your stars.
                </p>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 6: Birth Date ===== */}
          {currentStep.id === 'birthdate' && (
            <motion.div
              key="birthdate"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center mb-8">
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
              </div>

              <div className="w-full space-y-4">
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
              </div>
            </motion.div>
          )}

          {/* ===== SPLASH: Analyzing cosmic blueprint ===== */}
          {currentStep.id === 'splash-analyzing' && (
            <motion.div
              key="splash-analyzing"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {/* ===== STEP 8: Teaser Reading ===== */}
          {currentStep.id === 'teaser' && (
            <motion.div
              key="teaser"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center py-8 min-h-[calc(100dvh-100px)] overflow-y-auto"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer z-10">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="w-full">
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
                  {insightCount > 0 && (
                    <p className="text-gold/50 text-xs mt-2">
                      Stella, your AI astrologer, found {insightCount} insights in your chart
                    </p>
                  )}
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
                  onClick={() => goForward(8)}
                  className="w-full btn-primary py-4 text-[1rem] cursor-pointer"
                >
                  Unlock Your Full Reading
                </button>
                <div className="h-12" />
              </div>
            </motion.div>
          )}

          {/* ===== STEP 9: Email Capture ===== */}
          {currentStep.id === 'email' && (
            <motion.div
              key="email"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center justify-center min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center mb-8">
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
                <p className="text-white/20 text-xs mt-2">
                  Join 10,000+ people who start their day with the stars
                </p>
              </div>

              <div className="w-full space-y-4">
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
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
              </div>
            </motion.div>
          )}

          {/* ===== STEP 10: Full Reading + Upsell ===== */}
          {currentStep.id === 'reading' && (
            <motion.div
              key="reading"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="flex flex-col items-center py-8 min-h-[calc(100dvh-100px)]"
            >
              {showBackButton && (
                <button onClick={goBack} className="absolute top-4 left-0 text-white/30 hover:text-white/60 p-2 transition-colors cursor-pointer">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="text-center mb-6">
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
              </div>

              {/* Full reading */}
              <div className="glass-card p-6 mb-6 w-full">
                {state.fullReading.split('\n\n').map((para, i) => (
                  <p key={i} className="text-white/70 leading-relaxed text-[0.95rem] font-light mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>

              {/* Locked sections */}
              <div className="w-full space-y-2 mb-6">
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
              </div>

              {/* Pricing CTA */}
              {selectedPlan && clientSecret ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <PaymentForm
                    clientSecret={clientSecret}
                    planName={selectedPlan === 'star' ? 'Star' : 'Cosmic'}
                    planPrice={selectedPlan === 'star' ? '$9.99/mo' : '$19.99/mo'}
                    onSuccess={handlePaymentSuccess}
                    onChangePlan={handleChangePlan}
                  />
                </motion.div>
              ) : selectedPlan && paymentLoading ? (
                <div className="w-full text-center py-8">
                  <motion.p
                    className="text-white/50 text-sm"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Setting up your subscription...
                  </motion.p>
                </div>
              ) : !showPricing ? (
                <button
                  onClick={() => setShowPricing(true)}
                  className="w-full btn-primary py-4 text-[1rem] cursor-pointer"
                >
                  Unlock Everything
                </button>
              ) : (
                <div className="w-full space-y-3">
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
                      onClick={() => handleSelectPlan('star')}
                      disabled={paymentLoading}
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
                      onClick={() => handleSelectPlan('cosmic')}
                      disabled={paymentLoading}
                      className="w-full btn-ghost py-3 cursor-pointer disabled:opacity-50"
                    >
                      Subscribe
                    </button>
                  </div>

                  {state.error && (
                    <p className="text-red-400/80 text-sm text-center">{state.error}</p>
                  )}
                </div>
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

/* ======= Loading Animation (Splash - Analyzing) ======= */
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
        className="text-white/50 text-[1.1rem] font-heading font-light"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing your cosmic blueprint...
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
