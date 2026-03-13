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
    <div className="min-h-dvh flex flex-col items-center justify-center bg-black px-5">
      <MetaPixel />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-[480px] w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl mb-8 opacity-60"
        >
          ✦
        </motion.div>

        <h1 className="text-section text-white/90 mb-4">
          Welcome to the cosmos
        </h1>

        <p className="text-white/50 mb-12 leading-relaxed text-sm font-light">
          Your premium cosmic experience is now active.
          The stars have so much to share with you.
        </p>

        <div className="space-y-3">
          <Link
            href="/chat"
            className="block w-full btn-primary py-4 text-center"
          >
            Chat with Stella
          </Link>

          <Link
            href="/birth-chart"
            className="block w-full btn-ghost py-4 text-center"
          >
            View Your Full Horoscope
          </Link>

          <Link
            href="/compatibility"
            className="block w-full btn-ghost py-4 text-center"
          >
            Check Compatibility
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-10">
          <Link href="/" className="hover:text-white/40 transition-colors">
            askthestars.ai
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
