'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Daily horoscope for your sign',
      '3 AI astrologer questions per day',
      '1 compatibility check per day',
      'Basic birth chart',
    ],
    cta: 'Get Started',
    href: '/birth-chart',
    highlighted: false,
  },
  {
    name: 'Star',
    price: '$9.99',
    period: '/month',
    planKey: 'star',
    features: [
      'Everything in Free',
      'Unlimited AI chat with Stella',
      'Personalized daily readings',
      'Full birth chart analysis',
      'Detailed compatibility readings',
    ],
    cta: 'Subscribe to Star ✦',
    highlighted: true,
  },
  {
    name: 'Cosmic',
    price: '$19.99',
    period: '/month',
    planKey: 'cosmic',
    features: [
      'Everything in Star',
      'Relationship synastry readings',
      'Career & purpose guidance',
      'Monthly forecast reports',
      'Priority access to new features',
    ],
    cta: 'Go Cosmic ✦',
    highlighted: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Subscriptions are being set up. Check back soon!');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Unlock the <span className="text-gradient-gold">full cosmos</span>
          </h1>
          <p className="text-white-muted font-light max-w-md mx-auto">
            Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className={`glass-card p-8 relative ${
                plan.highlighted ? 'border border-gold/20 shadow-[0_0_30px_rgba(212,168,83,0.1)]' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[10px] font-medium px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-light text-gradient-gold">{plan.price}</span>
                  <span className="text-sm text-white-dim">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white-muted font-light">
                    <span className="text-gold/50 mt-0.5 shrink-0">✦</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.planKey ? (
                <button
                  onClick={() => handleSubscribe(plan.planKey!)}
                  disabled={loading === plan.planKey}
                  className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gold text-navy hover:bg-gold-light gold-glow'
                      : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20'
                  } disabled:opacity-50`}
                >
                  {loading === plan.planKey ? 'Redirecting...' : plan.cta}
                </button>
              ) : (
                <a
                  href={plan.href}
                  className="block w-full py-3 rounded-full text-sm font-medium text-center bg-white/5 text-white-muted border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  {plan.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-white-dim mt-8"
        >
          All plans include a 7-day money-back guarantee. Cancel anytime from your account.
        </motion.p>
      </div>
    </div>
  );
}
