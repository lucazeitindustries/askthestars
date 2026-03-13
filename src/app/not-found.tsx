'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <p className="text-7xl md:text-8xl font-heading font-light text-white/10 mb-8">404</p>

        <h1 className="text-section text-white/90 mb-4">
          Lost in the cosmos
        </h1>

        <p className="text-white/50 font-light max-w-md mb-12 leading-relaxed text-body">
          The page you seek has drifted beyond the observable universe.
          Perhaps the stars have a different path in mind.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-ghost">
            Return Home
          </Link>
          <Link href="/birth-chart" className="btn-ghost">
            Get Your Reading
          </Link>
        </div>

        <p className="text-[10px] text-white/20 mt-16">
          Even the stars lose their way sometimes.
        </p>
      </motion.div>
    </div>
  );
}
