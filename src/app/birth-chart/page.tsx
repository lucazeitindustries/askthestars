'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingIllustration from '@/components/FloatingIllustration';

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
}

interface ChartResult {
  sun: string;
  moon: string;
  rising: string | null;
  planets: PlanetPosition[];
  note: string;
}

type Step = 'date' | 'time' | 'place' | 'ready';

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function BirthChartPage() {
  const [step, setStep] = useState<Step>('date');
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    knowsTime: true,
  });
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visibleSections, setVisibleSections] = useState(0);

  const handleSubmit = async () => {
    if (!formData.birthDate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.birthDate,
          time: formData.knowsTime ? formData.birthTime : undefined,
          place: formData.birthPlace || undefined,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setChart(data);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleSections(count);
        if (count >= 5) clearInterval(interval);
      }, 400);
    } catch (error) {
      console.error('Birth chart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSaving(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          birthDate: formData.birthDate,
          birthTime: formData.knowsTime ? formData.birthTime : undefined,
          birthPlace: formData.birthPlace || undefined,
        }),
      });
      if (res.ok) {
        setSaved(true);
        if (typeof window !== 'undefined' && 'mixpanel' in window) {
          (window as unknown as { mixpanel: { track: (event: string, props?: Record<string, unknown>) => void } }).mixpanel.track('signup', { source: 'birth_chart' });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step === 'date' && formData.birthDate) setStep('time');
    else if (step === 'time') setStep('place');
    else if (step === 'place') {
      setStep('ready');
      handleSubmit();
    }
  };

  const stepNumber = step === 'date' ? 1 : step === 'time' ? 2 : step === 'place' ? 3 : 3;

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
            src="/illustrations/birth-chart-illustration.png"
            alt="Birth chart celestial illustration"
            width={200}
            height={200}
            opacity={0.6}
            className="mb-6"
          />
          <h1 className="text-section mb-4 text-white/90">
            Your cosmic blueprint
          </h1>
          <p className="text-white/50 text-body">
            Enter your birth details for a personalized natal chart.
          </p>
        </motion.div>

        {/* Step-by-step form */}
        {!chart && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    n <= stepNumber ? 'bg-gold' : 'bg-white/10'
                  }`} />
                  {n < 3 && <div className={`w-8 h-px transition-all duration-500 ${
                    n < stepNumber ? 'bg-gold/30' : 'bg-white/10'
                  }`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'date' && (
                <motion.div key="date" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 text-center">
                    When were you born?
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    required
                    autoFocus
                    className="[color-scheme:dark] text-center text-lg"
                  />
                  <button
                    onClick={nextStep}
                    disabled={!formData.birthDate}
                    className="w-full mt-8 btn-ghost disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 'time' && (
                <motion.div key="time" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 text-center">
                    What time?
                  </label>
                  {formData.knowsTime ? (
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                      autoFocus
                      className="[color-scheme:dark] text-center text-lg"
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-white/30 leading-relaxed">
                        Your reading will still be accurate for sun sign, but moon and rising require exact birth time.
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, knowsTime: !formData.knowsTime })}
                    className="block mx-auto text-xs text-gold/60 hover:text-gold transition-colors mt-4 cursor-pointer"
                  >
                    {formData.knowsTime ? "I don't know my birth time" : 'I know my birth time'}
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full mt-8 btn-ghost"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 'place' && (
                <motion.div key="place" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 text-center">
                    Where were you born?
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    autoFocus
                    className="text-center"
                  />
                  <p className="text-[10px] text-white/20 mt-3 text-center">
                    Used to calculate planetary positions at your location
                  </p>
                  <button
                    onClick={nextStep}
                    className="w-full mt-8 btn-primary"
                  >
                    Generate My Birth Chart
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

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
            <p className="text-xs text-white/30 mt-4">Calculating your chart...</p>
          </motion.div>
        )}

        {/* Chart Results — staggered reveal */}
        <AnimatePresence>
          {chart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Big Three */}
              {visibleSections >= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8 text-center">
                    Your Big Three
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { icon: '☉', label: 'Sun', value: chart.sun, desc: 'Your core identity' },
                      { icon: '☽', label: 'Moon', value: chart.moon, desc: 'Your emotional self' },
                      { icon: '↑', label: 'Rising', value: chart.rising || '—', desc: chart.rising ? 'How others see you' : 'Needs birth time' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                      >
                        <p className="text-2xl mb-2 opacity-50">{item.icon}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-sm text-white/80 font-heading">{item.value}</p>
                        <p className="text-[10px] text-white/20 mt-1">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Planetary Positions — simple list */}
              {visibleSections >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">
                    Planetary Positions
                  </p>
                  <div className="space-y-0">
                    {chart.planets.map((p, i) => (
                      <motion.div
                        key={p.planet}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm text-white/50">{p.planet}</span>
                        <span className="text-sm text-white/70">
                          {p.sign} {p.degree}°
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Note */}
              {visibleSections >= 3 && chart.note && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-[10px] text-white/20 px-4"
                >
                  {chart.note}
                </motion.p>
              )}

              {/* Save Reading */}
              {visibleSections >= 4 && (
                <>
                  {!saved ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="border-t border-white/5 pt-8"
                    >
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2 text-center">
                        Save Your Reading
                      </p>
                      <p className="text-xs text-white/30 text-center mb-6">
                        Enter your email to save your chart and get personalized daily readings.
                      </p>
                      <form onSubmit={handleSaveReading} className="flex gap-3 items-end">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1"
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="btn-primary shrink-0 py-3 px-6 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4 border-t border-white/5"
                    >
                      <p className="text-gold text-sm">✦ Saved! Check back daily for personalized insights.</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* CTA */}
              {visibleSections >= 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center pt-4"
                >
                  <a href="/chat" className="btn-ghost inline-block">
                    Ask Stella About Your Chart
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals */}
        {!chart && !loading && step === 'date' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 text-center"
          >
            {[
              { value: '50K+', label: 'Charts Generated' },
              { value: '12', label: 'Zodiac Signs' },
              { value: '100%', label: 'Free Reading' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-base font-heading text-white/70">{stat.value}</p>
                <p className="text-[10px] text-white/20 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
