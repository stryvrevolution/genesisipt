'use client';

import { useEffect } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuccessGPlusPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/analyse-ipt');
    }, 3000);

    useEffect(() => {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (!sessionId) return;
    
      fetch('/api/stripe/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data?.formula) {
            localStorage.setItem('stryv_formula', data.formula);
          }
        })
        .catch(err => {
          console.error('Erreur récupération formule Stripe', err);
        });
    }, []);

    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#303030] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[#252525] border border-white/5 rounded-2xl p-8 md:p-10">

        <div className="w-12 h-12 rounded-full bg-[#DAFA72]/10 flex items-center justify-center mb-6">
          <Check className="w-6 h-6 text-[#DAFA72]" />
        </div>

        <h1 className="font-outfit text-2xl md:text-3xl font-medium mb-4">
          paiement confirmé
        </h1>

        <p className="text-white/60 text-sm leading-relaxed mb-6">
          votre protocole G+ a bien été activé.
          la première étape consiste à réaliser l’analyse IPT,
          indispensable pour adapter le protocole à votre potentiel
          réel de transformation.
        </p>

        <div className="border-l border-[#DAFA72]/30 pl-4 mb-8">
          <p className="text-white/70 text-sm leading-relaxed">
            vous allez être redirigé automatiquement vers
            le questionnaire d’analyse IPT.
          </p>
        </div>

        <a
          href="/analyse-ipt"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DAFA72] text-black text-sm font-bold transition-transform hover:scale-[1.03]"
        >
          commencer maintenant
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <p className="mt-6 text-[11px] text-white/30 leading-relaxed">
          le protocole G+ inclut une analyse IPT et une adaptation
          stratégique. aucun résultat n’est promis sans diagnostic
          préalable.
        </p>

      </div>
    </main>
  );
}
