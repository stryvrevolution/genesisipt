'use client';

import Link from 'next/link';
import { Check, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';

useEffect(() => {
  // 🔐 autorisation serveur G+
  document.cookie = "stryv_access=gplus; path=/; max-age=86400";
}, []);


export default function SuccessGPlusPage() {
  return (
    <main className="min-h-screen bg-[#303030] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[#252525] border border-white/5 rounded-2xl p-8 md:p-10">

        <div className="w-12 h-12 rounded-full bg-[#DAFA72]/10 flex items-center justify-center mb-6">
          <Check className="w-6 h-6 text-[#DAFA72]" />
        </div>

        <h1 className="font-outfit text-2xl md:text-3xl font-medium mb-4">
          Paiement confirmé
        </h1>

        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Votre protocole G+ a bien été activé.
          La première étape consiste à réaliser l’analyse IPT,
          indispensable pour adapter le protocole à votre potentiel
          réel de transformation.
        </p>

        <div className="border-l border-[#DAFA72]/30 pl-4 mb-8">
          <p className="text-white/70 text-sm leading-relaxed">
            Vous allez pouvoir accéder à la phase de pré-analyse IPT,
            utilisée comme socle d’adaptation stratégique du protocole G+.
          </p>
        </div>

        <Link
          href="/ipt/pre-analyse?mode=gplus"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DAFA72] text-black text-sm font-bold transition-transform hover:scale-[1.03]"
        >
          Commencer maintenant
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        <p className="mt-6 text-[11px] text-white/30 leading-relaxed">
          Le protocole G+ inclut une analyse IPT et une adaptation
          stratégique. Aucun résultat n’est promis sans diagnostic
          préalable.
        </p>

      </div>
    </main>
  );
}
