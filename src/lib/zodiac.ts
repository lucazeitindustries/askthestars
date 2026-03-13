export interface ZodiacSign {
  name: string;
  slug: string;
  symbol: string;
  element: string;
  modality: string;
  ruler: string;
  dates: string;
  traits: string[];
  description: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    slug: 'aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    ruler: 'Mars',
    dates: 'March 21 – April 19',
    traits: ['Bold', 'Ambitious', 'Energetic', 'Pioneering'],
    description: 'The first sign of the zodiac. Aries leads with courage and unshakable determination, blazing trails where others hesitate.',
  },
  {
    name: 'Taurus',
    slug: 'taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    ruler: 'Venus',
    dates: 'April 20 – May 20',
    traits: ['Grounded', 'Sensual', 'Patient', 'Determined'],
    description: 'Rooted in the material world, Taurus finds beauty in stability. A sign of endurance, pleasure, and quiet strength.',
  },
  {
    name: 'Gemini',
    slug: 'gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    ruler: 'Mercury',
    dates: 'May 21 – June 20',
    traits: ['Curious', 'Adaptable', 'Witty', 'Social'],
    description: 'The twins of the zodiac — endlessly curious, quick-witted, and at home in the world of ideas and conversation.',
  },
  {
    name: 'Cancer',
    slug: 'cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    ruler: 'Moon',
    dates: 'June 21 – July 22',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
    description: 'Guided by the Moon, Cancer feels deeply and protects fiercely. A sign of home, memory, and emotional intelligence.',
  },
  {
    name: 'Leo',
    slug: 'leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    ruler: 'Sun',
    dates: 'July 23 – August 22',
    traits: ['Confident', 'Generous', 'Creative', 'Dramatic'],
    description: 'Ruled by the Sun, Leo radiates warmth and commands attention. A sign of creative self-expression and generous leadership.',
  },
  {
    name: 'Virgo',
    slug: 'virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    ruler: 'Mercury',
    dates: 'August 23 – September 22',
    traits: ['Analytical', 'Precise', 'Devoted', 'Practical'],
    description: 'Virgo sees what others miss. Meticulous and service-oriented, this sign finds purpose in refinement and quiet devotion.',
  },
  {
    name: 'Libra',
    slug: 'libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    ruler: 'Venus',
    dates: 'September 23 – October 22',
    traits: ['Balanced', 'Diplomatic', 'Aesthetic', 'Harmonious'],
    description: 'Libra seeks beauty and balance in all things. A sign of partnership, justice, and the art of graceful connection.',
  },
  {
    name: 'Scorpio',
    slug: 'scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    ruler: 'Pluto',
    dates: 'October 23 – November 21',
    traits: ['Intense', 'Magnetic', 'Perceptive', 'Transformative'],
    description: 'Scorpio descends into the depths others fear. A sign of transformation, power, and unflinching emotional truth.',
  },
  {
    name: 'Sagittarius',
    slug: 'sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    ruler: 'Jupiter',
    dates: 'November 22 – December 21',
    traits: ['Adventurous', 'Philosophical', 'Optimistic', 'Free-spirited'],
    description: 'The archer aims for horizons unknown. Sagittarius lives for expansion — of mind, spirit, and experience.',
  },
  {
    name: 'Capricorn',
    slug: 'capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    ruler: 'Saturn',
    dates: 'December 22 – January 19',
    traits: ['Ambitious', 'Disciplined', 'Strategic', 'Resilient'],
    description: 'Capricorn builds empires through patience and discipline. A sign of long-term vision, structure, and earned authority.',
  },
  {
    name: 'Aquarius',
    slug: 'aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    ruler: 'Uranus',
    dates: 'January 20 – February 18',
    traits: ['Visionary', 'Independent', 'Humanitarian', 'Inventive'],
    description: 'Aquarius sees the future before it arrives. A sign of innovation, collective progress, and unapologetic individuality.',
  },
  {
    name: 'Pisces',
    slug: 'pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    ruler: 'Neptune',
    dates: 'February 19 – March 20',
    traits: ['Intuitive', 'Compassionate', 'Dreamy', 'Artistic'],
    description: 'Pisces dissolves the boundaries between self and cosmos. A sign of imagination, empathy, and transcendence.',
  },
];

export function getSign(slug: string): ZodiacSign | undefined {
  return zodiacSigns.find((s) => s.slug === slug);
}

export function getAdjacentSigns(slug: string): { prev: ZodiacSign; next: ZodiacSign } {
  const idx = zodiacSigns.findIndex((s) => s.slug === slug);
  const prev = zodiacSigns[(idx - 1 + 12) % 12];
  const next = zodiacSigns[(idx + 1) % 12];
  return { prev, next };
}

// Placeholder daily readings (will be AI-generated later)
export function getDailyReading(sign: string): { overall: string; love: string; career: string; wellness: string; luckyNumber: number; mood: string } {
  const readings: Record<string, { overall: string; love: string; career: string; wellness: string; luckyNumber: number; mood: string }> = {
    aries: {
      overall: 'The stars align in your favor today, Aries. A bold move you\'ve been contemplating is supported by Mars\' current position. Trust your instincts — they\'re sharper than usual. Something unexpected before noon could shift your perspective on a long-standing situation.',
      love: 'Venus casts a warm glow on your relationships. If single, a chance encounter could spark something meaningful. If partnered, make time for honest conversation — vulnerability is your superpower today.',
      career: 'Your leadership energy is magnetic right now. A project that felt stalled may suddenly gain momentum. Don\'t hesitate to take the lead — others are looking to you for direction.',
      wellness: 'Channel that fire energy through physical movement. A morning run or intense workout will set the tone for the day. Pay attention to your shoulders and neck — they may hold tension.',
      luckyNumber: 7,
      mood: 'Energized',
    },
    taurus: {
      overall: 'Patience pays dividends today, Taurus. Something you\'ve been building quietly is about to show results. The Moon in your sector of resources suggests a financial insight or material gain. Stay grounded in your values.',
      love: 'Sensuality is heightened today. Small gestures mean more than grand declarations — a lingering touch, a thoughtful note. If you\'re seeking connection, look for someone who shares your appreciation for life\'s finer things.',
      career: 'A practical approach wins over flashy ideas today. Your ability to see the long game gives you an edge. A conversation with a mentor or colleague could open doors you didn\'t know existed.',
      wellness: 'Your body is asking for nourishment — both literal and spiritual. Prepare a beautiful meal, spend time in nature, or simply sit in stillness. Earth signs recharge through the senses.',
      luckyNumber: 4,
      mood: 'Content',
    },
    gemini: {
      overall: 'Your mind is electric today, Gemini. Mercury enhances your already quicksilver thinking. Connections between seemingly unrelated ideas will click into place. A conversation could be more important than it seems — listen between the lines.',
      love: 'Words are your love language, and today they carry extra weight. Share what you\'re really thinking — not just the clever version. Authenticity draws the right people closer.',
      career: 'Communication projects are favored. Writing, presenting, networking — you\'re in your element. A dual opportunity may present itself; you don\'t have to choose immediately.',
      wellness: 'Mental stimulation is great, but don\'t forget to breathe. Your nervous system could use a reset — try breathwork or a quiet walk. Hands and arms may need stretching.',
      luckyNumber: 5,
      mood: 'Curious',
    },
    cancer: {
      overall: 'The Moon, your ruler, illuminates your inner world today. Emotions that surface aren\'t random — they\'re guiding you toward something important. Home and family matters take center stage. Trust your intuition; it\'s your greatest compass.',
      love: 'Emotional depth is your gift, and today it\'s a magnet. Someone may confide in you or express feelings they\'ve been holding back. Create a safe space — your nurturing energy heals.',
      career: 'Behind-the-scenes work bears fruit. You don\'t need the spotlight to make an impact. A creative project connected to home, food, or wellness could gain unexpected traction.',
      wellness: 'Protect your energy today. Not every emotional wave is yours to ride. Water therapy — a bath, swimming, or simply drinking more water — restores your equilibrium.',
      luckyNumber: 2,
      mood: 'Reflective',
    },
    leo: {
      overall: 'The Sun spotlights your natural brilliance today, Leo. Creative energy is at a peak, and others are drawn to your warmth. A moment of recognition or praise is coming — receive it graciously. Your generosity inspires those around you.',
      love: 'Romance is playful and dramatic in the best way. If single, your magnetic energy is hard to resist — step into any room with confidence. Partnered Leos, plan something that breaks routine.',
      career: 'Leadership opportunities arise. Your vision is clear and others want to follow it. A creative risk pays off — don\'t water down your ideas to make them more "acceptable."',
      wellness: 'Your heart — both physical and emotional — needs attention. Do something joyful, purely for the sake of joy. Dance, create, play. Your vitality comes from self-expression.',
      luckyNumber: 1,
      mood: 'Radiant',
    },
    virgo: {
      overall: 'Details reveal the bigger picture today, Virgo. Your analytical mind sees patterns others miss. A health or work routine adjustment you make now could have lasting benefits. Perfection isn\'t the goal — purpose is.',
      love: 'Acts of service speak louder than words today. Showing up reliably, remembering the small things — this is how you love. Let someone take care of you for a change.',
      career: 'Organization is your superpower. A system you implement or a process you improve saves everyone time. Don\'t undervalue your contribution just because it\'s not flashy.',
      wellness: 'Gut health and digestion are highlighted. Pay attention to what nourishes vs. what depletes. A methodical approach to wellness yields better results than dramatic changes.',
      luckyNumber: 6,
      mood: 'Focused',
    },
    libra: {
      overall: 'Balance shifts in your favor today, Libra. Venus graces your interactions with beauty and harmony. A partnership — romantic or professional — reaches a new understanding. Aesthetic choices you make today will please you for a long time.',
      love: 'You\'re irresistible when you\'re being authentically you — not when you\'re trying to keep everyone happy. Speak your truth today, even if it disrupts the peace. The right people will love you more for it.',
      career: 'Collaboration is your strength today. Bringing opposing viewpoints together creates something neither side could achieve alone. Design, beauty, or justice-related projects are especially favored.',
      wellness: 'Kidney and lower back health deserve attention. Beautiful environments boost your mood more than you realize — rearrange a space, buy flowers, or simply declutter.',
      luckyNumber: 8,
      mood: 'Harmonious',
    },
    scorpio: {
      overall: 'Transformation is your natural state, Scorpio, and today it accelerates. Something you\'ve been holding onto is ready to be released. Power comes not from control but from surrender. An intense interaction reveals a hidden truth.',
      love: 'Depth is non-negotiable for you, and today you\'ll see who can meet you there. Surface-level connections fall away naturally. If partnered, a vulnerable conversation deepens your bond profoundly.',
      career: 'Research, investigation, or strategic planning is favored. You see through facades — use this skill to make better decisions. Financial matters, especially shared resources, require your attention.',
      wellness: 'Release what you\'re carrying. Whether through intense exercise, journaling, or crying — let it move through you. Your body stores what your mind tries to suppress.',
      luckyNumber: 9,
      mood: 'Intense',
    },
    sagittarius: {
      overall: 'Adventure calls, Sagittarius, even if it\'s a journey of the mind. Jupiter expands your horizons today — through a book, a conversation, or a sudden insight. Optimism is your fuel, but make sure it\'s grounded in reality, not just hope.',
      love: 'Freedom and intimacy aren\'t opposites — they\'re partners. Today brings clarity about what kind of relationship allows you to be your fullest self. Honest conversations about needs are favored.',
      career: 'Big-picture thinking sets you apart. While others are in the weeds, you see the whole landscape. Teaching, publishing, or international connections are highlighted.',
      wellness: 'Your hips and thighs hold your restless energy. Move your body through space — hiking, horseback riding, or exploring a new neighborhood on foot. Adventure is medicine.',
      luckyNumber: 3,
      mood: 'Expansive',
    },
    capricorn: {
      overall: 'Structure serves your ambitions today, Capricorn. Saturn rewards discipline, and a long-term goal shows tangible progress. Authority figures may play a significant role. Remember — the mountain is climbed one step at a time.',
      love: 'You show love through loyalty and reliability. Today, let someone see behind the composed exterior. Vulnerability isn\'t weakness — for Capricorn, it\'s the ultimate act of trust.',
      career: 'Your reputation precedes you in the best way. Professional recognition or a milestone is possible. Strategic decisions made today have long-lasting consequences — choose wisely.',
      wellness: 'Bones, joints, and teeth need your attention. Calcium, weight-bearing exercise, and good posture aren\'t boring — they\'re investments. Schedule that appointment you\'ve been postponing.',
      luckyNumber: 10,
      mood: 'Determined',
    },
    aquarius: {
      overall: 'Innovation strikes like lightning today, Aquarius. Uranus electrifies your thinking with ideas that are ahead of their time. Community connections bring unexpected opportunities. Don\'t try to fit in — you\'re meant to stand out.',
      love: 'Intellectual connection is the gateway to your heart. Someone who challenges your thinking is more attractive than someone who simply agrees. Friendships may blur into something more.',
      career: 'Technology, humanitarian work, or group projects are favored. Your unique perspective solves a problem everyone else is approaching conventionally. Don\'t dim your weird — it\'s your competitive advantage.',
      wellness: 'Circulation and the nervous system are your focus areas. Cold exposure, breathwork, or anything that gets energy moving through your body works wonders. Rest your mind from screens tonight.',
      luckyNumber: 11,
      mood: 'Visionary',
    },
    pisces: {
      overall: 'The veil between worlds is thin today, Pisces. Neptune enhances your already extraordinary intuition. Dreams carry messages — pay attention to what comes to you in quiet moments. Artistic expression is a channel for cosmic downloads.',
      love: 'You love without boundaries, which is beautiful and dangerous. Today, discern between compassion and self-sacrifice. The right love doesn\'t require you to dissolve — it helps you become more yourself.',
      career: 'Creative and healing professions are highlighted. Your empathy is a professional skill, not just a personal one. Music, art, therapy, or spiritual work is especially favored today.',
      wellness: 'Feet and the immune system need attention. Salt baths, grounding exercises, and adequate sleep are non-negotiable. You absorb the energy around you — cleanse regularly.',
      luckyNumber: 12,
      mood: 'Dreamy',
    },
  };

  return readings[sign] || readings.aries;
}
