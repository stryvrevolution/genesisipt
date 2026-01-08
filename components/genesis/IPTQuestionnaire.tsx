'use client';

import React from 'react';
import Link from 'next/link';

// ICI : On définit que le composant a le droit de recevoir une fonction "onComplete"
interface IPTQuestionnaireProps {
  onComplete?: () => void;
}

export default function IPTQuestionnaire({ onComplete }: IPTQuestionnaireProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-center space-y-4">
      <h2 className="text-xl font-bold text-white uppercase tracking-widest">
        Analyse IPT™
      </h2>
      
      <p className="text-sm text-white/60 leading-relaxed">
        Prêt à lancer votre analyse de profil ?
      </p>

      {/* Redirection vers la page dédiée */}
      <Link href="/ipt/pre-analyse" className="block w-full">
        <button className="w-full py-4 rounded-xl bg-[#DAFA72] text-black font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform">
          Démarrer
        </button>
      </Link>
      
      {/* (Optionnel) Un bouton pour fermer le modal si besoin */}
      {onComplete && (
          <button onClick={onComplete} className="text-xs text-white/30 hover:text-white mt-4 underline">
            Fermer
          </button>
      )}
    </div>
  );
}