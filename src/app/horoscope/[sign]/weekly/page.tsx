import { notFound } from 'next/navigation';
import Link from 'next/link';
import { zodiacSigns, getSign, getAdjacentSigns } from '@/lib/zodiac';
import type { Metadata } from 'next';
import WeeklyClient from './WeeklyClient';

export function generateStaticParams() {
  return zodiacSigns.map((sign) => ({ sign: sign.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};

  return {
    title: `${sign.name} Weekly Horoscope — This Week's Reading`,
    description: `Free weekly ${sign.name} horoscope. ${sign.description} Get your AI-powered weekly forecast with love, career, and personal growth insights.`,
    alternates: { canonical: `https://askthestars.ai/horoscope/${sign.slug}/weekly` },
    openGraph: {
      title: `${sign.name} Weekly Horoscope — Ask the Stars`,
      description: `${sign.symbol} This week's ${sign.name} horoscope. AI-powered astrology reading based on current planetary positions.`,
      url: `https://askthestars.ai/horoscope/${sign.slug}/weekly`,
    },
  };
}

export default async function WeeklyHoroscopePage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();

  const { prev, next } = getAdjacentSigns(slug);

  return <WeeklyClient sign={sign} prev={prev} next={next} />;
}
