'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface FloatingIllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  opacity?: number;
  className?: string;
  blendMode?: 'screen' | 'normal';
}

export default function FloatingIllustration({
  src,
  alt,
  width,
  height,
  opacity = 0.7,
  className = '',
  blendMode = 'normal',
}: FloatingIllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`flex justify-center ${className}`}
      style={{ mixBlendMode: blendMode }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ opacity, width: '100%', maxWidth: width, height: 'auto' }}
        priority={false}
      />
    </motion.div>
  );
}
