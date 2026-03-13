import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Unlock the Full Cosmos',
  description: 'Start free with daily horoscopes and 3 AI questions per day. Upgrade to Star ($9.99/mo) or Cosmic ($19.99/mo) for unlimited readings, full birth chart analysis, and more.',
  alternates: { canonical: 'https://askthestars.ai/pricing' },
  openGraph: {
    title: 'Pricing — Ask the Stars',
    description: 'Free daily horoscopes. Upgrade for unlimited AI astrologer access and premium readings.',
    url: 'https://askthestars.ai/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
