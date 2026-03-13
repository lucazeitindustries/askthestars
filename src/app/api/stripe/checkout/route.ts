import { stripe, PLANS } from '@/lib/stripe';

export async function POST(req: Request) {
  if (!stripe) {
    return Response.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  try {
    const { plan, email } = await req.json();

    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig || !planConfig.priceId) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      ...(email ? { customer_email: email } : {}),
      success_url: `${req.headers.get('origin') || 'https://askthestars.ai'}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.get('origin') || 'https://askthestars.ai'}/?canceled=true`,
      metadata: {
        plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
