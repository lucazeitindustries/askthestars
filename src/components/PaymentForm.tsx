'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const appearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#d4a853',
    colorBackground: '#000000',
    colorText: '#ffffff',
    colorDanger: '#ff4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'transparent',
    },
    '.Input:focus': {
      border: '1px solid rgba(212,168,83,0.5)',
      boxShadow: 'none',
    },
    '.Label': {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '12px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
  },
};

interface PaymentFormProps {
  clientSecret: string;
  planName: string;
  planPrice: string;
  onSuccess: () => void;
  onChangePlan: () => void;
}

function CheckoutForm({
  planName,
  planPrice,
  onSuccess,
  onChangePlan,
}: Omit<PaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Something went wrong');
      setProcessing(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/quiz/success`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please try again.');
      setProcessing(false);
    } else {
      // Payment succeeded without redirect (no 3DS)
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Plan summary */}
      <div className="flex items-center justify-between py-3 px-4 border border-white/10">
        <span className="text-white/80 text-sm font-heading">
          {planName} Plan
        </span>
        <span className="text-white/90 text-sm font-heading">{planPrice}</span>
      </div>

      <PaymentElement />

      {error && (
        <p className="text-red-400/80 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary py-4 text-[1rem] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Subscribe'}
      </button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onChangePlan}
          className="text-white/30 text-xs hover:text-white/50 transition-colors cursor-pointer"
        >
          ← Change plan
        </button>
        <span className="text-white/20 text-[10px]">
          Powered by Stripe
        </span>
      </div>
    </form>
  );
}

export default function PaymentForm({
  clientSecret,
  planName,
  planPrice,
  onSuccess,
  onChangePlan,
}: PaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance }}
    >
      <CheckoutForm
        planName={planName}
        planPrice={planPrice}
        onSuccess={onSuccess}
        onChangePlan={onChangePlan}
      />
    </Elements>
  );
}
