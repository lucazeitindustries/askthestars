import { notFound } from 'next/navigation';
import Link from 'next/link';
import { zodiacSigns, getSign, getAdjacentSigns, getDailyReading } from '@/lib/zodiac';
import type { Metadata } from 'next';
import HoroscopeClient from './HoroscopeClient';

export function generateStaticParams() {
  return zodiacSigns.map((sign) => ({ sign: sign.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return {
    title: `${sign.name} Horoscope Today — ${today}`,
    description: `Free daily ${sign.name} horoscope. ${sign.description} Read your personalized AI-powered reading for today.`,
    alternates: { canonical: `https://askthestars.ai/horoscope/${sign.slug}` },
    openGraph: {
      title: `${sign.name} Daily Horoscope — Ask the Stars`,
      description: `${sign.symbol} Today's ${sign.name} horoscope. AI-powered astrology reading based on current planetary positions.`,
      url: `https://askthestars.ai/horoscope/${sign.slug}`,
    },
  };
}

export default async function HoroscopePage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();

  const reading = getDailyReading(slug);
  const { prev, next } = getAdjacentSigns(slug);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return <HoroscopeClient sign={sign} reading={reading} prev={prev} next={next} today={today} />;
}
