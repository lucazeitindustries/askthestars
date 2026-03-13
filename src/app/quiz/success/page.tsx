'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MetaPixel, { trackEvent } from '@/components/MetaPixel';
import Link from 'next/link';

export default function QuizSuccessPage() {
  useEffect(() => {
    trackEvent('Purchase');
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--navy)] px-5">
      <MetaPixel />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-[480px] w-full text-center"
      >
        {/* Celebration animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-6"
        >
          ✨
        </motion.div>

        <h1 className="text-[clamp(2rem,5vw,2.5rem)] font-light mb-3">
          Welcome to the <span className="text-gradient-gold">cosmos</span> ✦
        </h1>

        <p className="text-white-muted mb-10 leading-relaxed">
          Your premium cosmic experience is now active.
          The stars have so much to share with you.
        </p>

        <div className="space-y-3">
          <Link
            href="/chat"
            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)]
                       text-[var(--navy)] font-semibold text-[1.05rem]
                       hover:shadow-[0_0_30px_rgba(212,168,83,0.3)] transition-all text-center"
          >
            💬 Chat with Stella
          </Link>

          <Link
            href="/birth-chart"
            className="block w-full py-4 rounded-2xl glass-card text-white font-medium
                       hover:border-[rgba(212,168,83,0.3)] transition-all text-center"
          >
            🌟 View Your Full Horoscope
          </Link>

          <Link
            href="/compatibility"
            className="block w-full py-4 rounded-2xl glass-card text-white font-medium
                       hover:border-[rgba(212,168,83,0.3)] transition-all text-center"
          >
            💕 Check Compatibility
          </Link>
        </div>

        <p className="text-white-dim text-xs mt-8">
          <Link href="/" className="hover:text-white transition-colors">
            askthestars.ai
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
