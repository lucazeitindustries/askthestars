import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarField from '@/components/StarField';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Ask the Stars — AI-Powered Personal Astrology',
    template: '%s | Ask the Stars',
  },
  description:
    'Discover your cosmic blueprint with AI-powered astrology readings. Free daily horoscopes, birth chart analysis, compatibility checks, and personalized guidance from the stars.',
  keywords: [
    'astrology',
    'horoscope',
    'birth chart',
    'zodiac',
    'compatibility',
    'AI astrology',
    'daily horoscope',
    'natal chart',
  ],
  metadataBase: new URL('https://askthestars.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://askthestars.ai',
    siteName: 'Ask the Stars',
    title: 'Ask the Stars — AI-Powered Personal Astrology',
    description:
      'Discover your cosmic blueprint with AI-powered astrology readings. Free daily horoscopes, birth charts, and personalized guidance.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ask the Stars — AI Astrology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask the Stars — AI-Powered Personal Astrology',
    description:
      'Discover your cosmic blueprint with AI-powered astrology readings.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-[family-name:var(--font-inter)] antialiased min-h-screen">
        <StarField />
        <Navigation />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
