'use client';

import { motion } from 'framer-motion';

const CDN_BASE = 'https://askthestars-assets.b-cdn.net';

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
  // Convert local path to CDN URL
  const cdnSrc = src.startsWith('/illustrations/')
    ? `${CDN_BASE}/${src.replace('/illustrations/', '')}`
    : src;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`flex justify-center ${className}`}
      style={{ mixBlendMode: blendMode }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cdnSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ opacity, width: '100%', maxWidth: width, height: 'auto' }}
      />
    </motion.div>
  );
}
