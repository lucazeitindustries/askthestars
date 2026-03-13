import { calculateBirthChart } from '@/lib/astrology';

export async function POST(req: Request) {
  try {
    const { date, time, place } = await req.json();

    if (!date) {
      return Response.json({ error: 'Date is required' }, { status: 400 });
    }

    // Validate date format
    const parsedDate = new Date(date + 'T12:00:00Z');
    if (isNaN(parsedDate.getTime())) {
      return Response.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const chart = calculateBirthChart(date, time || undefined);

    return Response.json({
      date,
      time: time || null,
      place: place || null,
      sun: chart.sun,
      moon: chart.moon,
      rising: chart.rising,
      planets: chart.planets,
      note: !time
        ? 'Moon and Rising signs are approximate without an exact birth time.'
        : 'Rising sign is approximate. For precision, a full ephemeris calculation would be needed.',
    });
  } catch (error) {
    console.error('Birth chart API error:', error);
    return Response.json(
      { error: 'Failed to calculate birth chart' },
      { status: 500 }
    );
  }
}
