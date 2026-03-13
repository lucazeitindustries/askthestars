import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getCurrentTransits } from '@/lib/astrology';
import { zodiacSigns } from '@/lib/zodiac';

const cache = new Map<string, { data: Record<string, unknown>; month: string }>();

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sign: string }> }
) {
  const { sign } = await params;
  const signInfo = zodiacSigns.find((s) => s.slug === sign);
  if (!signInfo) {
    return Response.json({ error: 'Invalid sign' }, { status: 400 });
  }

  const month = getMonthKey();
  const cacheKey = `${sign}-${month}`;

  if (cache.has(cacheKey)) {
    return Response.json(cache.get(cacheKey)!.data);
  }

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      sign: signInfo.name,
      month: monthName,
      reading: `${monthName} brings transformative energy for ${signInfo.name}. The cosmos is preparing something special — check back for your full monthly forecast.`,
      key_dates: [],
      overall_theme: 'Transformation',
    });
  }

  try {
    const openai = new OpenAI();
    const transits = getCurrentTransits();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Stella, an expert astrologer. Generate a monthly horoscope forecast. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Generate the monthly horoscope for ${signInfo.name} for ${monthName}.

Current planetary transits: ${transits}

Guidelines:
- 8-12 sentences covering the month's major astrological events
- Divide into early, mid, and late month sections
- Reference significant planetary transits, new/full moons
- Cover love, career, finances, and personal growth
- Identify key dates and turning points
- Be detailed and specific

Respond with this JSON structure:
{
  "sign": "${signInfo.name}",
  "month": "${monthName}",
  "reading": "full monthly overview text",
  "overall_theme": "one phrase theme",
  "love": "2-3 sentences on love this month",
  "career": "2-3 sentences on career this month",
  "finances": "1-2 sentences on finances",
  "wellness": "1-2 sentences on health/wellness",
  "key_dates": ["date: brief description", "date: brief description"],
  "power_days": [1, 15, 22],
  "mantra": "a short monthly mantra or affirmation"
}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response');

    const data = JSON.parse(content);
    cache.set(cacheKey, { data, month });
    return Response.json(data);
  } catch (error) {
    console.error(`Monthly horoscope error for ${sign}:`, error);
    return Response.json({
      sign: signInfo.name,
      month: monthName,
      reading: `${monthName} invites ${signInfo.name} into a profound period of transformation. The planets are shifting in ways that favor bold moves and deep reflection. Trust the process.`,
      overall_theme: 'Transformation',
      key_dates: [],
      mantra: 'Trust the journey.',
    });
  }
}
