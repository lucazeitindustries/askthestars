import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Your Cosmic Reading | Ask the Stars',
  description: 'Get a personalized AI astrology reading based on your birth chart. Discover what the stars reveal about your love life, career, and personal growth.',
  robots: { index: false, follow: false },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No Navigation or Footer — this is a clean funnel page
  return <>{children}</>;
}
