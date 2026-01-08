import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Création session Stripe — PROTOCOLE G+
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      // 👇 AJOUTE CETTE LIGNE POUR ACTIVER LE CHAMP CODE PROMO
      allow_promotion_codes: true,

      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Protocole G+ — Adaptation stratégique basée sur l’IPT',
              description:
                'Protocole personnalisé sur 6 semaines incluant une analyse IPT complète, ' +
                'le calcul de l’indice de potentiel de transformation (IPT™), ' +
                'un rapport de potentiel de transformation et une adaptation stratégique ' +
                'basée sur le potentiel mesuré.',
            },
            unit_amount: 17500, // 175 €
          },
          quantity: 1,
        },
      ],

      mode: 'payment',

      // ✅ MÉTADONNÉES CANONIQUES
      metadata: {
        product_type: 'protocol',
        formula: 'gplus',
        includes_ipt: 'true',
        ipt_required: 'true',
        duration_weeks: '6',
        access_type: 'automatic',
        version: 'v1',
      },
      

      success_url: `${baseUrl}/checkout-success/gplus?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/analyse-ipt`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe G+:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session Stripe G+' },
      { status: 500 }
    );
  }
}