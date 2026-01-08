'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function OmniPreAnalysePage() {
  const mode = 'omni';

  // 🔒 Nettoyage préventif
  useEffect(() => {
    localStorage.removeItem('stryv_analysis_unlocked');
  }, []);

  const titles: Record<string, string> = {
    omni: 'Initialisation OMNI',
  };

  return (
    <main className="min-h-screen bg-[#303030] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-[#252525] border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">

        {/* Petit badge de succès en haut à droite pour confirmer que le RDV est pris */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAFA72]/10 border border-[#DAFA72]/20">
            <CheckCircle2 className="w-3 h-3 text-[#DAFA72]" />
            <span className="text-[10px] font-bold text-[#DAFA72] uppercase tracking-widest">Kick-off planifié</span>
        </div>

        {/* TITRE & DESCRIPTION */}
        <h1 className="font-outfit text-2xl md:text-3xl font-medium mb-6 text-white">
          {titles[mode]}
        </h1>

        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Votre créneau est sécurisé. Vous entrez maintenant dans la phase de **profilage technique**. 
          L’analyse IPT™ qui suit servira de base à votre premier audit lors de l'appel.
        </p>

        {/* CONTEXTE MÉTHODOLOGIQUE */}
        <div className="space-y-4 text-sm text-white/60 leading-relaxed mb-8">
          <p>
            L’analyse IPT™ repose sur un système adaptatif et conditionnel.
            Toutes les questions ne sont pas posées à tout le monde.
          </p>

          <p>
            Vos réponses activent ou neutralisent certaines branches
            d’analyse afin d’identifier les leviers prioritaires
            et les contraintes dominantes.
          </p>
        </div>

        {/* ENCART INFO */}
        <div className="border-l border-[#DAFA72]/30 pl-4 mb-8">
          <p className="text-white/70 text-sm">
            Temps estimé : 10 à 15 minutes.<br />
            Aucune donnée médicale n’est requise à ce stade.
          </p>
        </div>

        {/* BOUTON D'ACTION (Vers Analyse IPT et NON Booking) */}
        <Link
          href="/analyse-ipt" 
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#DAFA72] hover:bg-white text-[#1A1A1A] text-sm font-bold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(218,250,114,0.3)] hover:scale-[1.02]"
        >
          Lancer mon profilage IPT
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        <p className="mt-4 text-[11px] text-white/30 leading-relaxed text-center">
          Ces données seront étudiées par votre expert avant le Kick-off.
        </p>

      </div>
    </main>
  );
}