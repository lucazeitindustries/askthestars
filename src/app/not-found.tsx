import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Lost in the Cosmos',
  description: 'The page you seek is beyond the stars. Return to Ask the Stars for your cosmic reading.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <p className="text-8xl md:text-9xl font-light text-gradient-gold opacity-30">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">✦</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-light tracking-tight mt-8 mb-4">
        Lost in the <span className="text-gradient-gold">cosmos</span>
      </h1>

      <p className="text-white-muted font-light max-w-md mb-10 leading-relaxed">
        The page you seek has drifted beyond the observable universe. 
        Perhaps the stars have a different path in mind for you.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-gold text-navy font-medium rounded-full text-sm hover:bg-gold-light transition-all duration-300"
        >
          Return Home
        </Link>
        <Link
          href="/birth-chart"
          className="px-8 py-3 border border-white/10 rounded-full text-sm text-white-muted hover:text-white hover:border-white/20 transition-all duration-300"
        >
          Get Your Reading
        </Link>
      </div>

      <p className="text-[11px] text-white-dim mt-12">
        Even the stars lose their way sometimes.
      </p>
    </div>
  );
}
