'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function ShootingStar({ delay, top, left }: { delay: number; top: string; left: string }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 4,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="w-[80px] h-[1.5px] bg-gradient-to-r from-transparent via-gold/80 to-transparent rounded-full"
        style={{ transform: 'rotate(-35deg)' }}
        animate={{
          x: [0, 200],
          y: [0, 120],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          delay,
          repeat: Infinity,
          repeatDelay: 3 + Math.random() * 4,
          ease: 'easeIn',
        }}
      />
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Shooting stars */}
      <ShootingStar delay={0.5} top="15%" left="10%" />
      <ShootingStar delay={2.5} top="25%" left="60%" />
      <ShootingStar delay={5} top="40%" left="30%" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="relative mb-8">
          <p className="text-8xl md:text-9xl font-light text-gradient-gold opacity-20">404</p>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-5xl">✦</span>
          </motion.div>
        </div>

        <h1 className="text-section mb-4">
          Lost in the <span className="text-gradient-gold">cosmos</span>
        </h1>

        <p className="text-secondary font-light max-w-md mb-10 leading-relaxed text-body">
          The page you seek has drifted beyond the observable universe.
          Perhaps the stars have a different path in mind.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gold text-navy font-medium rounded-full text-sm hover:bg-gold-light transition-all duration-300"
          >
            Return Home
          </Link>
          <Link
            href="/birth-chart"
            className="px-8 py-3 border border-white/10 rounded-full text-sm text-secondary hover:text-white hover:border-white/20 transition-all duration-300"
          >
            Get Your Reading
          </Link>
        </div>

        <p className="text-[11px] text-hint mt-12">
          Even the stars lose their way sometimes.
        </p>
      </motion.div>
    </div>
  );
}
