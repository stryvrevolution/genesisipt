'use client';

import Link from 'next/link';
import { Check, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';

useEffect(() => {
  // 🔐 autorisation serveur IPT
  document.cookie = "stryv_access=ipt; path=/; max-age=86400";
}, []);


export default function SuccessIPTPage() {
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
          Vous venez d’activer une analyse IPT™.
          Cette analyse permet d’évaluer votre potentiel réel de transformation
          et de générer un rapport d’interprétation structuré.
        </p>

        <div className="border-l border-[#DAFA72]/30 pl-4 mb-8">
          <p className="text-white/70 text-sm leading-relaxed">
            Prochaine étape : accéder à la phase de pré-analyse.
            Elle vous explique le fonctionnement de l’analyse adaptative
            avant de commencer.
          </p>
        </div>

        <Link
          href="/ipt/pre-analyse?mode=ipt"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DAFA72] text-black text-sm font-bold transition-transform hover:scale-[1.03]"
        >
          Accéder à la pré-analyse IPT™
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        <p className="mt-6 text-[11px] text-white/30 leading-relaxed">
          Ce service correspond à une analyse et à un rapport
          d’interprétation. Aucun programme ni promesse de
          transformation n’est inclus à ce stade.
        </p>

      </div>
    </main>
  );
}
