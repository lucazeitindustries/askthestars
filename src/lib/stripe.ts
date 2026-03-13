import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set — Stripe features will be disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const PLANS = {
  star: {
    name: 'Star',
    price: '$9.99/mo',
    priceId: process.env.STRIPE_STAR_PRICE_ID || '',
    features: [
      'Unlimited AI chat',
      'Personalized daily readings',
      'Full birth chart analysis',
    ],
  },
  cosmic: {
    name: 'Cosmic',
    price: '$19.99/mo',
    priceId: process.env.STRIPE_COSMIC_PRICE_ID || '',
    features: [
      'Everything in Star',
      'Relationship readings',
      'Career guidance',
      'Monthly forecast',
    ],
  },
};
