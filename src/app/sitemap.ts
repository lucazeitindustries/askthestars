import { MetadataRoute } from 'next';
import { zodiacSigns } from '@/lib/zodiac';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://askthestars.ai';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/birth-chart`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/chat`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/compatibility`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
  ];

  const horoscopePages = zodiacSigns.map((sign) => ({
    url: `${baseUrl}/horoscope/${sign.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Compatibility combo pages (future)
  const compatPages: MetadataRoute.Sitemap = [];
  for (const s1 of zodiacSigns) {
    for (const s2 of zodiacSigns) {
      compatPages.push({
        url: `${baseUrl}/compatibility/${s1.slug}-${s2.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...horoscopePages, ...compatPages];
}
