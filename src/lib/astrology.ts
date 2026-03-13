// Simplified astrology calculations for MVP
// Sun sign from date, approximate Moon sign, no external dependencies

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
}

interface BirthChart {
  sun: string;
  moon: string;
  rising: string | null;
  planets: PlanetPosition[];
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Sun sign boundaries (month, day) — start dates for each sign
const SUN_SIGN_DATES: [number, number, string][] = [
  [1, 20, 'Aquarius'],
  [2, 19, 'Pisces'],
  [3, 21, 'Aries'],
  [4, 20, 'Taurus'],
  [5, 21, 'Gemini'],
  [6, 21, 'Cancer'],
  [7, 23, 'Leo'],
  [8, 23, 'Virgo'],
  [9, 23, 'Libra'],
  [10, 23, 'Scorpio'],
  [11, 22, 'Sagittarius'],
  [12, 22, 'Capricorn'],
];

export function getSunSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (let i = SUN_SIGN_DATES.length - 1; i >= 0; i--) {
    const [m, d, sign] = SUN_SIGN_DATES[i];
    if (month > m || (month === m && day >= d)) {
      return sign;
    }
  }
  return 'Capricorn'; // Jan 1-19
}

// Approximate Moon sign based on date
// The Moon changes sign roughly every 2.5 days
// This uses a simplified calculation based on a known epoch
export function getApproxMoonSign(date: Date): string {
  // Reference: Jan 1, 2024 00:00 UTC, Moon was in Virgo (index 5)
  const epoch = new Date('2024-01-01T00:00:00Z');
  const msPerDay = 86400000;
  const daysSinceEpoch = (date.getTime() - epoch.getTime()) / msPerDay;

  // Moon completes a full cycle in ~27.32 days (sidereal month)
  const moonCycleDays = 27.321661;
  const signsPerDay = 12 / moonCycleDays;

  const signOffset = (daysSinceEpoch * signsPerDay) % 12;
  const signIndex = ((Math.floor(signOffset) + 5) % 12 + 12) % 12; // +5 for Virgo start

  return SIGNS[signIndex];
}

// Approximate rising sign (very rough — needs exact time and location for accuracy)
// For MVP: estimate based on birth time (the sign rising at ~6am is the sun sign)
export function getApproxRising(date: Date, timeStr?: string): string | null {
  if (!timeStr) return null;

  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;

  // The ascendant cycles through all 12 signs in 24 hours
  // At sunrise (~6am), the ascendant is approximately the sun sign
  const sunSign = getSunSign(date);
  const sunSignIndex = SIGNS.indexOf(sunSign);

  // Each sign takes ~2 hours. Offset from 6am.
  const minutesFrom6am = ((totalMinutes - 360) + 1440) % 1440;
  const signOffset = Math.floor(minutesFrom6am / 120);

  const risingIndex = (sunSignIndex + signOffset) % 12;
  return SIGNS[risingIndex];
}

export function calculateBirthChart(dateStr: string, timeStr?: string): BirthChart {
  const date = new Date(dateStr + 'T12:00:00Z');

  const sun = getSunSign(date);
  const moon = getApproxMoonSign(date);
  const rising = getApproxRising(date, timeStr);

  // Generate approximate planetary positions for the birth date
  // These are rough approximations for MVP
  const planets: PlanetPosition[] = [
    { planet: 'Sun', sign: sun, degree: Math.floor(Math.random() * 29) + 1 },
    { planet: 'Moon', sign: moon, degree: Math.floor(Math.random() * 29) + 1 },
  ];

  if (rising) {
    planets.push({ planet: 'Ascendant', sign: rising, degree: Math.floor(Math.random() * 29) + 1 });
  }

  // Approximate other planets based on their average orbital periods
  const innerPlanets = [
    { name: 'Mercury', cycleDays: 87.97, epochSign: 3 },
    { name: 'Venus', cycleDays: 224.7, epochSign: 7 },
    { name: 'Mars', cycleDays: 686.97, epochSign: 10 },
  ];

  const epoch = new Date('2024-01-01T00:00:00Z');
  const daysSinceEpoch = (date.getTime() - epoch.getTime()) / 86400000;

  for (const p of innerPlanets) {
    const signOffset = (daysSinceEpoch / p.cycleDays) * 12;
    const signIndex = ((Math.floor(signOffset) + p.epochSign) % 12 + 12) % 12;
    planets.push({
      planet: p.name,
      sign: SIGNS[signIndex],
      degree: Math.floor(Math.abs(signOffset % 1) * 30),
    });
  }

  // Outer planets move slowly, approximate positions
  const outerPlanets = [
    { name: 'Jupiter', cycleDays: 4332.59, epochSign: 0 }, // Aries in early 2024
    { name: 'Saturn', cycleDays: 10759.22, epochSign: 11 }, // Pisces in early 2024
    { name: 'Uranus', cycleDays: 30688.5, epochSign: 1 }, // Taurus
    { name: 'Neptune', cycleDays: 60182, epochSign: 11 }, // Pisces
    { name: 'Pluto', cycleDays: 90560, epochSign: 9 }, // Capricorn/Aquarius
  ];

  for (const p of outerPlanets) {
    const signOffset = (daysSinceEpoch / p.cycleDays) * 12;
    const signIndex = ((Math.floor(signOffset) + p.epochSign) % 12 + 12) % 12;
    planets.push({
      planet: p.name,
      sign: SIGNS[signIndex],
      degree: Math.floor(Math.abs(signOffset % 1) * 30),
    });
  }

  return { sun, moon, rising, planets };
}

// Get current transit info for daily horoscopes
export function getCurrentTransits(): string {
  const now = new Date();
  const moonSign = getApproxMoonSign(now);

  // Check for retrogrades (simplified — Mercury retrogrades ~3x/year for ~3 weeks)
  const retrogrades: string[] = [];
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  // Mercury retrograde periods (approximate for any year)
  const mercuryRetro = [
    [10, 30], [105, 125], [215, 235], [320, 340],
  ];
  for (const [start, end] of mercuryRetro) {
    if (dayOfYear >= start && dayOfYear <= end) {
      retrogrades.push('Mercury');
      break;
    }
  }

  const sunSign = getSunSign(now);

  return `Moon in ${moonSign}. Sun in ${sunSign}.${retrogrades.length > 0 ? ` ${retrogrades.join(', ')} retrograde.` : ''} Date: ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`;
}
