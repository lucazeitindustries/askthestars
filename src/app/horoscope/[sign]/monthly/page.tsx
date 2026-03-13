import { notFound } from 'next/navigation';
import Link from 'next/link';
import { zodiacSigns, getSign, getAdjacentSigns } from '@/lib/zodiac';
import type { Metadata } from 'next';
import MonthlyClient from './MonthlyClient';

export function generateStaticParams() {
  return zodiacSigns.map((sign) => ({ sign: sign.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    title: `${sign.name} Monthly Horoscope — ${monthName}`,
    description: `Free monthly ${sign.name} horoscope for ${monthName}. ${sign.description} Get your AI-powered monthly forecast with detailed love, career, and financial insights.`,
    alternates: { canonical: `https://askthestars.ai/horoscope/${sign.slug}/monthly` },
    openGraph: {
      title: `${sign.name} Monthly Horoscope — ${monthName} | Ask the Stars`,
      description: `${sign.symbol} ${monthName} ${sign.name} horoscope. AI-powered monthly astrology forecast.`,
      url: `https://askthestars.ai/horoscope/${sign.slug}/monthly`,
    },
  };
}

export default async function MonthlyHoroscopePage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();

  const { prev, next } = getAdjacentSigns(slug);

  return <MonthlyClient sign={sign} prev={prev} next={next} />;
}
