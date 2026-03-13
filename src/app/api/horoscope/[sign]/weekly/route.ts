import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getCurrentTransits } from '@/lib/astrology';
import { zodiacSigns } from '@/lib/zodiac';

const cache = new Map<string, { data: Record<string, unknown>; week: string }>();

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
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

  const week = getWeekKey();
  const cacheKey = `${sign}-${week}`;

  if (cache.has(cacheKey)) {
    return Response.json(cache.get(cacheKey)!.data);
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      sign: signInfo.name,
      week,
      reading: `This week's ${signInfo.name} horoscope is being channeled from the cosmos. Check back soon.`,
      themes: ['Growth', 'Reflection'],
      best_day: 'Wednesday',
      challenge_day: 'Friday',
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
          content: 'You are Stella, an expert astrologer. Generate a weekly horoscope overview. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Generate the weekly horoscope for ${signInfo.name} (week of ${week}).

Current planetary transits: ${transits}

Guidelines:
- 5-7 sentences covering the week's major themes
- Reference planetary transits relevant to this sign
- Cover love, career, and personal growth themes for the week
- Identify the best and most challenging days
- Be specific and actionable

Respond with this JSON structure:
{
  "sign": "${signInfo.name}",
  "week": "${week}",
  "reading": "weekly overview text",
  "themes": ["theme1", "theme2", "theme3"],
  "best_day": "day name",
  "challenge_day": "day name",
  "love_forecast": "1-2 sentences on love this week",
  "career_forecast": "1-2 sentences on career this week",
  "advice": "one key piece of advice for the week"
}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response');

    const data = JSON.parse(content);
    cache.set(cacheKey, { data, week });
    return Response.json(data);
  } catch (error) {
    console.error(`Weekly horoscope error for ${sign}:`, error);
    return Response.json({
      sign: signInfo.name,
      week,
      reading: `This week invites ${signInfo.name} into a period of growth and self-discovery. Pay attention to signals from the universe — they're guiding you toward your next chapter.`,
      themes: ['Growth', 'Reflection', 'Connection'],
      best_day: 'Wednesday',
      challenge_day: 'Monday',
    });
  }
}
