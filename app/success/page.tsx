'use client';

import { useEffect } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

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
      .finally(() => {
        // Redirection automatique vers le questionnaire IPT
        setTimeout(() => {
          router.push('/analyse-ipt');
        }, 2000);
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-[#303030] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[#252525] border border-white/5 rounded-2xl p-8 md:p-10">

        {/* Icône */}
        <div className="w-12 h-12 rounded-full bg-[#DAFA72]/10 flex items-center justify-center mb-6">
          <Check className="w-6 h-6 text-[#DAFA72]" />
        </div>

        {/* Titre */}
        <h1 className="font-outfit text-2xl md:text-3xl font-medium mb-4">
          paiement confirmé
        </h1>

        {/* Explication */}
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          vous venez de commander une analyse IPT.
          cette analyse permet de calculer votre indice de potentiel
          de transformation (IPT™) et de générer un rapport
          de potentiel de transformation.
        </p>

        {/* Prochaine étape */}
        <div className="border-l border-[#DAFA72]/30 pl-4 mb-8">
          <p className="text-white/70 text-sm leading-relaxed">
            prochaine étape : compléter le questionnaire nécessaire
            à l’analyse IPT.
          </p>
        </div>

        {/* CTA (fallback manuel) */}
        <a
          href="/analyse-ipt"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DAFA72] text-black text-sm font-bold transition-transform hover:scale-[1.03]"
        >
          commencer le questionnaire
          <ArrowUpRight className="w-4 h-4" />
        </a>

        {/* Disclaimer */}
        <p className="mt-6 text-[11px] text-white/30 leading-relaxed">
          ce service correspond à une analyse et à un rapport
          d’interprétation. aucun programme ni promesse de
          transformation n’est inclus à ce stade.
        </p>

      </div>
    </main>
  );
}
