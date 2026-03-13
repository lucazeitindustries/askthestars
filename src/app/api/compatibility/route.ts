import OpenAI from 'openai';
import { zodiacSigns } from '@/lib/zodiac';

export async function POST(req: Request) {
  try {
    const { sign1, sign2 } = await req.json();

    const s1 = zodiacSigns.find((s) => s.slug === sign1 || s.name.toLowerCase() === sign1?.toLowerCase());
    const s2 = zodiacSigns.find((s) => s.slug === sign2 || s.name.toLowerCase() === sign2?.toLowerCase());

    if (!s1 || !s2) {
      return Response.json({ error: 'Invalid signs provided' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Return element-based fallback
      const sameElement = s1.element === s2.element;
      const compatElements: Record<string, string[]> = {
        Fire: ['Air', 'Fire'], Air: ['Fire', 'Air'],
        Earth: ['Water', 'Earth'], Water: ['Earth', 'Water'],
      };
      const elementCompat = compatElements[s1.element]?.includes(s2.element);
      const score = sameElement ? 85 : elementCompat ? 72 : 58;

      return Response.json({
        score,
        spark: `${s1.name} and ${s2.name} share an intriguing cosmic connection.`,
        friction: 'Every pairing has its growth edges — these are yours to navigate together.',
        emotional: 'Your emotional styles may differ, offering a chance to learn from each other.',
        chemistry: 'The attraction between these signs is undeniable.',
        longterm: 'With awareness and communication, this pairing has real potential.',
        advice: 'Focus on understanding rather than changing each other.',
      });
    }

    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Stella, an expert astrologer analyzing romantic compatibility. Be honest but kind. Don't sugarcoat difficult aspects, but show how challenges can become growth. You MUST respond with valid JSON only, no markdown.`,
        },
        {
          role: 'user',
          content: `Analyze the romantic compatibility between ${s1.name} (${s1.element}, ${s1.modality}, ruled by ${s1.ruler}) and ${s2.name} (${s2.element}, ${s2.modality}, ruled by ${s2.ruler}).

Respond with this exact JSON structure:
{
  "score": number 1-100 (be realistic, most pairings 55-85),
  "spark": "What draws these two together — 2-3 sentences",
  "friction": "Where they'll challenge each other — 2-3 sentences",
  "emotional": "Moon/emotional connection analysis — 2-3 sentences",
  "chemistry": "Physical/passionate chemistry — 2-3 sentences",
  "longterm": "Long-term potential — 2-3 sentences",
  "advice": "One key insight for making this work — 1-2 sentences"
}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response');

    return Response.json(JSON.parse(content));
  } catch (error) {
    console.error('Compatibility API error:', error);
    return Response.json(
      { error: 'Failed to generate compatibility reading' },
      { status: 500 }
    );
  }
}
