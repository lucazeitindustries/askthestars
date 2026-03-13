'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  delay: number;
}

export default function SparkleEffect({
  trigger,
  count = 20,
  className = '',
}: {
  trigger: boolean;
  count?: number;
  className?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const p: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        p.push({
          id: i,
          x: 0,
          y: 0,
          angle,
          distance: 40 + Math.random() * 60,
          size: 2 + Math.random() * 3,
          duration: 0.6 + Math.random() * 0.4,
          delay: Math.random() * 0.2,
        });
      }
      setParticles(p);
      const t = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(t);
    }
  }, [trigger, count]);

  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, #e8c97a, #d4a853)`,
              boxShadow: '0 0 6px rgba(212, 168, 83, 0.6)',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              opacity: 0,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
