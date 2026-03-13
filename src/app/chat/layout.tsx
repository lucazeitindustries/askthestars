import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Stella — AI Astrologer Chat',
  description: 'Chat with Stella, your personal AI astrologer. Get personalized astrology readings, birth chart interpretations, and cosmic guidance based on real planetary positions.',
  alternates: { canonical: 'https://askthestars.ai/chat' },
  openGraph: {
    title: 'Ask Stella — AI Astrologer Chat | Ask the Stars',
    description: 'Chat with your personal AI astrologer. Get personalized readings based on real planetary data.',
    url: 'https://askthestars.ai/chat',
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
