import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // PAIEMENT RÉUSSI
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      const {
        email,
        session_id: sessionId,
        product_type: productType,
      } = paymentIntent.metadata;

      console.log('💰 Paiement réussi:', {
        email,
        sessionId,
        productType,
        amount: paymentIntent.amount,
      });

      // Marquer session comme payée
      if (sessionId) {
        await supabase
          .from('ipt_sessions')
          .update({
            paid: true,
            payment_intent_id: paymentIntent.id,
            payment_amount: paymentIntent.amount,
            payment_currency: paymentIntent.currency,
          })
          .eq('id', sessionId);
      }

      // Générer magic link Supabase Auth
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?session_id=${sessionId}&product=${productType}`,
        },
      });

      if (error) {
        console.error('❌ Erreur génération magic link:', error);
        throw error;
      }

      // Envoyer email via Resend
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'STRYV LAB <contact@stryvlab.com>',
          to: email,
          subject: '🎉 Créez votre compte STRYV LAB',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                .button { 
                  display: inline-block; 
                  background: #0e8c5b; 
                  color: white !important; 
                  padding: 16px 32px; 
                  text-decoration: none; 
                  border-radius: 8px;
                  font-weight: bold;
                  margin: 20px 0;
                }
                .footer { margin-top: 40px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🎉 Paiement confirmé !</h1>
                <p>Bonjour,</p>
                <p>Votre paiement pour <strong>${getProductName(productType)}</strong> a été validé.</p>
                <p>Créez votre compte STRYV LAB pour accéder à votre dashboard :</p>
                <div style="text-align: center;">
                  <a href="${data.properties.action_link}" class="button">
                    Créer mon compte
                  </a>
                </div>
                <p style="font-size: 12px; color: #666;">Ce lien est valide pendant 24h.</p>
                <div class="footer">
                  <p>STRYV LAB — GENESIS IPT™</p>
                  <p>Questions ? Répondez à cet email.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      console.log('📧 Email création compte envoyé à:', email);

      return NextResponse.json({ 
        received: true,
        action: 'account_creation_email_sent'
      });

    } catch (error) {
      console.error('❌ Erreur traitement paiement:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

function getProductName(type: string): string {
  const names: Record<string, string> = {
    ipt: 'Rapport IPT™',
    gplus: 'Système G+ (6 semaines)',
    omni: 'OMNI Hybrid (12 semaines)',
  };
  return names[type] || type;
}