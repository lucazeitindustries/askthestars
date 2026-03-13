'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
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
      // Staggered reveal of result sections
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-section mb-4">
            Your cosmic <span className="text-gradient-gold">blueprint</span>
          </h1>
          <p className="text-secondary text-body">
            Enter your birth details for a personalized natal chart.
          </p>
        </motion.div>

        {/* Step-by-step form */}
        {!chart && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card p-8 md:p-10"
          >
            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    n <= stepNumber ? 'bg-gold' : 'bg-white/10'
                  }`} />
                  {n < 3 && <div className={`w-8 h-px transition-all duration-500 ${
                    n < stepNumber ? 'bg-gold/50' : 'bg-white/10'
                  }`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 'date' && (
                <motion.div key="date" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-xs uppercase tracking-widest text-tertiary mb-3 text-center">
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
                    className="w-full mt-6 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 'time' && (
                <motion.div key="time" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-xs uppercase tracking-widest text-tertiary mb-3 text-center">
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
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/10 text-center">
                      <p className="text-xs text-tertiary leading-relaxed">
                        ✦ Your reading will still be accurate for sun sign, but moon and rising require exact birth time.
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, knowsTime: !formData.knowsTime })}
                    className="block mx-auto text-xs text-gold/60 hover:text-gold transition-colors mt-3"
                  >
                    {formData.knowsTime ? "I don't know my birth time" : 'I know my birth time'}
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full mt-6 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 'place' && (
                <motion.div key="place" {...slideIn} transition={{ duration: 0.35 }}>
                  <label className="block text-xs uppercase tracking-widest text-tertiary mb-3 text-center">
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
                  <p className="text-[11px] text-hint mt-2 text-center">
                    Used to calculate planetary positions at your location
                  </p>
                  <button
                    onClick={nextStep}
                    className="w-full mt-6 py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow"
                  >
                    Generate My Birth Chart ✦
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 md:p-10"
          >
            <div className="text-center mb-6">
              <motion.div
                className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="text-sm text-tertiary mt-4">Calculating your chart...</p>
            </div>
            <div className="space-y-4">
              <div className="skeleton h-16 w-full" />
              <div className="skeleton h-12 w-3/4 mx-auto" />
              <div className="skeleton h-12 w-2/3 mx-auto" />
            </div>
          </motion.div>
        )}

        {/* Chart Results — staggered reveal */}
        <AnimatePresence>
          {chart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Big Three — section 1 */}
              {visibleSections >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 md:p-10"
                  data-sound="reveal"
                >
                  <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-6 text-center">
                    Your Big Three
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { icon: '☉', label: 'Sun', value: chart.sun, desc: 'Your core identity' },
                      { icon: '☽', label: 'Moon', value: chart.moon, desc: 'Your emotional self' },
                      { icon: '↑', label: 'Rising', value: chart.rising || '—', desc: chart.rising ? 'How others see you' : 'Needs birth time' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                      >
                        <p className="text-3xl mb-2">{item.icon}</p>
                        <p className="text-xs text-tertiary mb-1">{item.label}</p>
                        <p className="text-sm font-medium text-gold">{item.value}</p>
                        <p className="text-[10px] text-hint mt-1">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Planetary Positions — section 2 */}
              {visibleSections >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 md:p-10"
                >
                  <h2 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-6">
                    Planetary Positions
                  </h2>
                  <div className="space-y-3">
                    {chart.planets.map((p, i) => (
                      <motion.div
                        key={p.planet}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm text-secondary">{p.planet}</span>
                        <span className="text-sm text-gold">
                          {p.sign} {p.degree}°
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Note — section 3 */}
              {visibleSections >= 3 && chart.note && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-[11px] text-hint px-4"
                >
                  {chart.note}
                </motion.p>
              )}

              {/* Save Reading — section 4 */}
              {visibleSections >= 4 && (
                <>
                  {!saved ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="glass-card p-8 border border-gold/10"
                    >
                      <h3 className="text-xs uppercase tracking-[0.2em] text-gold/60 mb-2 text-center">
                        Save Your Reading
                      </h3>
                      <p className="text-sm text-tertiary text-center mb-6">
                        Enter your email to save your chart and get personalized daily readings.
                      </p>
                      <form onSubmit={handleSaveReading} className="flex gap-3">
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
                          className="px-6 py-3 bg-gold text-navy font-medium rounded-full text-sm hover:bg-gold-light disabled:opacity-50 transition-all duration-300 shrink-0"
                        >
                          {saving ? 'Saving...' : 'Save ✦'}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-6 border border-gold/20 text-center"
                    >
                      <p className="text-gold text-sm">✦ Saved! Check back daily for personalized insights.</p>
                    </motion.div>
                  )}
                </>
              )}

              {/* CTA — section 5 */}
              {visibleSections >= 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center pt-4"
                >
                  <a
                    href="/chat"
                    className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full text-sm hover:bg-gold-light transition-all duration-300"
                  >
                    Ask Stella About Your Chart ✦
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals (only before results) */}
        {!chart && !loading && step === 'date' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-6 text-center"
          >
            {[
              { value: '50K+', label: 'Charts Generated' },
              { value: '12', label: 'Zodiac Signs' },
              { value: '100%', label: 'Free Reading' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-medium text-gradient-gold">{stat.value}</p>
                <p className="text-[11px] text-hint mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
