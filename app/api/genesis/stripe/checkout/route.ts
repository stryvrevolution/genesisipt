import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TIERS = {
  RAPPORT: {
    name: 'Rapport IPT Complet',
    price: 4900,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER1_RAPPORT!,
  },
  PROTOCOL: {
    name: 'Protocole Personnalisé',
    price: 14900,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER2_PROTOCOL!,
  },
  COACHING: {
    name: 'Coaching GENESIS 12 Semaines',
    price: 99900,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TIER3_COACHING!,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, tier, email } = body;

    if (!TIERS[tier as keyof typeof TIERS]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const selectedTier = TIERS[tier as keyof typeof TIERS];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: selectedTier.stripePriceId,
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/genesis/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/genesis/results/${submissionId}`,
      customer_email: email,
      metadata: { submissionId, tier },
    });

    await supabase.from('payment_transactions').insert({
      submission_id: submissionId,
      stripe_session_id: session.id,
      amount: selectedTier.price / 100,
      currency: 'EUR',
      tier,
      status: 'pending',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}