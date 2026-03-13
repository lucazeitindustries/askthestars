import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Birth Chart Reading — Your Cosmic Blueprint',
  description: 'Generate your free natal birth chart with AI-powered interpretation. Discover your sun, moon, and rising signs plus all planetary positions based on your exact birth details.',
  alternates: { canonical: 'https://askthestars.ai/birth-chart' },
  openGraph: {
    title: 'Free Birth Chart Reading — Ask the Stars',
    description: 'Generate your free natal birth chart. Discover your sun, moon, and rising signs with AI-powered interpretation.',
    url: 'https://askthestars.ai/birth-chart',
  },
};

export default function BirthChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
