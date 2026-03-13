'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BirthChartPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    knowsTime: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Process birth chart calculation
    console.log('Birth data:', formData);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">
            Birth Chart
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Your cosmic <span className="text-gradient-gold">blueprint</span>
          </h1>
          <p className="text-white-muted font-light max-w-md mx-auto">
            Enter your birth details to generate a personalized natal chart and AI-powered reading.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 md:p-10 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-white-dim mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-white-dim mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
              className="[color-scheme:dark]"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-white-dim">
                Time of Birth
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, knowsTime: !formData.knowsTime })}
                className="text-xs text-gold/70 hover:text-gold transition-colors"
              >
                {formData.knowsTime ? "I don't know my birth time" : 'I know my birth time'}
              </button>
            </div>
            {formData.knowsTime ? (
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="[color-scheme:dark]"
              />
            ) : (
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                <p className="text-xs text-white-dim leading-relaxed">
                  ✦ Your reading will still be accurate for sun sign, but moon and rising sign calculations require an exact birth time. Check your birth certificate or ask a parent!
                </p>
              </div>
            )}
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-white-dim mb-2">
              Place of Birth
            </label>
            <input
              type="text"
              placeholder="City, Country (e.g., New York, USA)"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              required
            />
            <p className="text-[11px] text-white-dim mt-2">
              Used to calculate planetary positions at your exact location
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gold text-navy font-medium rounded-full text-sm tracking-wide hover:bg-gold-light transition-all duration-300 gold-glow mt-4"
          >
            Generate My Birth Chart ✦
          </button>

          <p className="text-center text-[11px] text-white-dim">
            Free forever. No credit card required.
          </p>
        </motion.form>

        {/* Trust signals */}
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
              <p className="text-[11px] text-white-dim mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
