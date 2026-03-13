import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getCurrentTransits } from '@/lib/astrology';
import { zodiacSigns } from '@/lib/zodiac';

// In-memory cache for daily horoscopes (resets on cold start, good enough for MVP)
const cache = new Map<string, { data: Record<string, unknown>; date: string }>();

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
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

  const today = getTodayStr();
  const cacheKey = `${sign}-${today}`;

  // Return cached version if available
  if (cache.has(cacheKey)) {
    return Response.json(cache.get(cacheKey)!.data);
  }

  if (!process.env.OPENAI_API_KEY) {
    // Return placeholder if no API key
    return Response.json({
      sign: signInfo.name,
      date: today,
      reading: `Today's ${signInfo.name} horoscope is being prepared by the stars. Check back soon for your personalized reading.`,
      mood: 'Anticipatory',
      lucky_number: Math.floor(Math.random() * 99) + 1,
      color: 'Gold',
      focus_area: 'growth',
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
          content: `You are Stella, an expert astrologer. Generate today's horoscope. You MUST respond with valid JSON only, no markdown or extra text.`,
        },
        {
          role: 'user',
          content: `Generate today's horoscope for ${signInfo.name} (${today}).

Current planetary transits: ${transits}

Guidelines:
- 3-4 sentences, warm but specific
- Reference the actual transits affecting this sign today
- Cover one of: love, career, personal growth, or energy/mood
- Be actionable — give them something to do or think about today
- Don't be vague or generic. "Today is a good day" is banned.
- Vary the tone — sometimes encouraging, sometimes reflective, sometimes playful

Respond with this exact JSON structure:
{
  "sign": "${signInfo.name}",
  "date": "${today}",
  "reading": "your horoscope text here",
  "mood": "one word mood",
  "lucky_number": number between 1-99,
  "color": "a color that matches today's energy",
  "focus_area": "love|career|growth|energy"
}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    const data = JSON.parse(content);

    // Cache for the day
    cache.set(cacheKey, { data, date: today });

    return Response.json(data);
  } catch (error) {
    console.error(`Horoscope generation error for ${sign}:`, error);
    return Response.json(
      {
        sign: signInfo.name,
        date: today,
        reading: `The stars are aligning for ${signInfo.name} today. A period of reflection and growth awaits. Trust your instincts and stay open to unexpected connections.`,
        mood: 'Reflective',
        lucky_number: Math.floor(Math.random() * 99) + 1,
        color: 'Indigo',
        focus_area: 'growth',
      }
    );
  }
}
