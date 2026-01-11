import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisation Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST() {
  try {
    // 👇 CORRECTION CRITIQUE : On force l'adresse du site en ligne
    // (Cela empêche le retour vers localhost après paiement)
    const baseUrl = 'https://stryvlab.com';

    // Création session Stripe — PROTOCOLE G+
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      // ✅ Codes promo activés
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
            unit_amount: 25000, // 250,00 €
          },
          quantity: 1,
        },
      ],

      mode: 'payment',

      // ✅ MÉTADONNÉES
      metadata: {
        product_type: 'protocol',
        formula: 'gplus',
        includes_ipt: 'true',
        ipt_required: 'true',
        duration_weeks: '6',
        access_type: 'automatic',
        version: 'v1',
      },
      
      // URLs de redirection utilisant la bonne adresse
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