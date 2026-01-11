import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST() {
  try {
    // 👇 FIX : On force l'adresse de production
    const baseUrl = 'https://stryvlab.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
    
      // ✅ activation du champ code promo
      allow_promotion_codes: true,
    
      mode: 'payment',
    
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 80000, // 800 €
            product_data: {
              name: 'OMNI — Processus d’admission',
              description:
                'Activation du processus d’admission OMNI incluant l’évaluation stratégique, le kick-off obligatoire et l’analyse de compatibilité.',
            },
          },
          quantity: 1,
        },
      ],
    
      // 🔑 métadonnées stratégiques
      metadata: {
        formula: 'omni',
        product: 'omni_admission',
        requires_call: 'true',
        includes_ipt: 'true',
      },
      
      // 👇 Redirection sécurisée vers le domaine Vercel
      success_url: `${baseUrl}/checkout-success/omni?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/omni/admission`,

    });
      
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe OMNI:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session Stripe OMNI' },
      { status: 500 }
    );
  }
}