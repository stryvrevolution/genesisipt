import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisation de Stripe avec la version exigée par ton installation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // <--- C'est ici qu'on a corrigé la date
  typescript: true,
});

export async function POST() {
// ... le reste du code ne change pas
  try {
    // URL de base (localhost en dev, ton site en prod)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Création de la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Protocole G+ (STRYV lab)',
              description: 'Programme hybride 6 semaines : Programmation, Ajustements, App.',
            },
            unit_amount: 17500, // 175.00 € (en centimes)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/analyse-ipt`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la session' }, { status: 500 });
  }
}