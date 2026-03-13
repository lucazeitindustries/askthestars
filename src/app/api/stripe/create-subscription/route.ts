import { stripe, PLANS } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: Request) {
  if (!stripe) {
    return Response.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  try {
    const { plan, email } = await req.json();

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig || !planConfig.priceId) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Find or create customer by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customer: Stripe.Customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    // Create subscription with incomplete payment
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planConfig.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: { plan },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Create subscription error:', errMsg);
    return Response.json(
      { error: 'Failed to create subscription', detail: errMsg },
      { status: 500 },
    );
  }
}
