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
  count = 12,
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
          distance: 30 + Math.random() * 40,
          size: 1.5 + Math.random() * 2,
          duration: 0.8 + Math.random() * 0.4,
          delay: Math.random() * 0.15,
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
              background: '#d4a853',
            }}
            initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
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
