export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ask the Stars',
    url: 'https://askthestars.ai',
    description: 'AI-powered personal astrology readings. Daily horoscopes, birth chart analysis, compatibility checks, and personalized guidance.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://askthestars.ai/horoscope/{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a birth chart?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A birth chart (natal chart) is a map of the sky at the exact moment you were born. It shows the positions of the Sun, Moon, and planets in the zodiac signs and houses, revealing your personality traits, strengths, challenges, and life themes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How accurate are AI astrology readings?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ask the Stars uses real astronomical data for planetary positions combined with AI trained on traditional astrological interpretation. While no astrology reading is scientifically proven, our AI provides detailed, personalized insights based on your actual birth chart placements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need my birth time for a reading?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your birth time is needed for your rising sign (ascendant) and accurate house placements. Without it, you can still get your sun sign, moon sign, and planetary positions. Check your birth certificate or ask a family member for the most complete reading.',
        },
      },
      {
        '@type': 'Question',
        name: 'What zodiac signs are most compatible?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generally, signs of the same element (Fire: Aries, Leo, Sagittarius; Earth: Taurus, Virgo, Capricorn; Air: Gemini, Libra, Aquarius; Water: Cancer, Scorpio, Pisces) have natural compatibility. However, true compatibility depends on the full birth charts of both people, not just sun signs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the daily horoscopes free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! All daily, weekly, and monthly horoscopes on Ask the Stars are completely free. You also get 3 free AI astrologer chat questions per day and a free birth chart reading. Premium plans unlock unlimited chat and deeper readings.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ask the Stars',
    url: 'https://askthestars.ai',
    logo: 'https://askthestars.ai/og-image.png',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
