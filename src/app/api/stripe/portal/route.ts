import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  if (!stripe) {
    return Response.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return Response.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get('origin') || 'https://askthestars.ai'}/`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return Response.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
