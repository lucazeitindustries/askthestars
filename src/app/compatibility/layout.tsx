import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zodiac Compatibility Check — Cosmic Chemistry',
  description: 'Discover the cosmic chemistry between any two zodiac signs. Free AI-powered compatibility reading covering love, chemistry, emotional connection, and long-term potential.',
  alternates: { canonical: 'https://askthestars.ai/compatibility' },
  openGraph: {
    title: 'Zodiac Compatibility Check — Ask the Stars',
    description: 'Discover the cosmic chemistry between any two zodiac signs with AI-powered compatibility analysis.',
    url: 'https://askthestars.ai/compatibility',
  },
};

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
