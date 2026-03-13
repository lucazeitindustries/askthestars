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
    cta: 'Subscribe to Star',
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
    cta: 'Go Cosmic',
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">Pricing</p>
          <h1 className="text-section text-white/90 mb-4">
            Unlock the full cosmos
          </h1>
          <p className="text-white/50 font-light max-w-md mx-auto text-sm">
            Start free, upgrade when you&apos;re ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className={`p-8 relative border ${
                plan.highlighted ? 'border-white/15' : 'border-white/[0.08]'
              }`}
            >
              {plan.highlighted && (
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold text-[10px] uppercase tracking-[0.2em] bg-black px-3">
                  Most Popular
                </p>
              )}

              <div className="text-center mb-10">
                <h3 className="text-base font-heading mb-3 text-white/80">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-heading font-light text-white/90">{plan.price}</span>
                  <span className="text-xs text-white/30">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/50 font-light">
                    <span className="text-white/20 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.planKey ? (
                <button
                  onClick={() => handleSubscribe(plan.planKey!)}
                  disabled={loading === plan.planKey}
                  className={`w-full cursor-pointer ${
                    plan.highlighted ? 'btn-primary' : 'btn-ghost'
                  } disabled:opacity-50`}
                >
                  {loading === plan.planKey ? 'Redirecting...' : plan.cta}
                </button>
              ) : (
                <a
                  href={plan.href}
                  className="block w-full text-center btn-ghost"
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
          className="text-center text-[10px] text-white/20 mt-10"
        >
          All plans include a 7-day money-back guarantee. Cancel anytime from your account.
        </motion.p>
      </div>
    </div>
  );
}
