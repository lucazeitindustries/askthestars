'use client';

export const CDN_BASE = 'https://askthestars-assets.b-cdn.net';

/** Convert a local /illustrations/ path to CDN WebP URL */
export function cdnUrl(src: string): string {
  if (src.startsWith('/illustrations/')) {
    const name = src.replace('/illustrations/', '').replace(/\.png$/, '.webp');
    return `${CDN_BASE}/${name}`;
  }
  return src;
}

interface FloatingIllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  opacity?: number;
  className?: string;
  blendMode?: 'screen' | 'normal';
  priority?: boolean;
}

export default function FloatingIllustration({
  src,
  alt,
  width,
  height,
  opacity = 0.7,
  className = '',
  blendMode = 'normal',
  priority = false,
}: FloatingIllustrationProps) {
  const resolvedSrc = cdnUrl(src);

  return (
    <div
      className={`flex justify-center ${className}`}
      style={{ mixBlendMode: blendMode }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ opacity, width: '100%', maxWidth: width, height: 'auto' }}
      />
    </div>
  );
}
