"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import localFont from "next/font/local";

// Chemin corrigé pour remonter de 2 niveaux (app/omni/pre-analyse -> app/fonts)
const michroma = localFont({
  src: "../../fonts/Michroma-Regular.ttf",
  display: "swap",
});

export default function OmniPreAnalysePage() {

  // Sauvegarde spécifique pour OMNI
  const handleSessionInit = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("omni_session_status", "started");
      localStorage.setItem("omni_timestamp", Date.now().toString());
    }
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
      
      {/* Texture de fond */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      {/* Dégradés d'arrière-plan (Nuance légèrement plus froide/violette pour OMNI si désiré, ou identique) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-4 relative z-10">

        {/* --- CARTE 1 : IDENTITÉ & TEXTES --- */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col items-center space-y-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-1">
            <span className={`${michroma.className} text-xl md:text-2xl font-bold uppercase tracking-[0.1em] text-slate-900`}>
              GENESIS
            </span>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
              BY STRYV LAB
            </p>
          </div>

          <div className="w-full border-t border-slate-200"></div>

          {/* Titre & Textes */}
          <div className="space-y-6 w-full">
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 text-center">
              Pré-analyse IPT™
            </h1>
            
            <div className="text-[13px] leading-relaxed text-slate-600 space-y-4 font-medium text-left">
              <p>
                Vous entrez dans une phase de pré-analyse. Cette étape configure le cadre 
                bioclimatique avant le lancement de l’analyse OMNI. 
                Aucune donnée n’est encore interprétée à ce stade.
              </p>
              <p>
                L’analyse OMNI™ repose sur une corrélation globale (Physiologie & Environnement). 
                Chaque paramètre influence directement votre profil final.
              </p>
              <p>
                Certaines réponses nécessitent de consulter vos données récentes (poids, activité). 
                La précision est primordiale ici.
              </p>
            </div>
          </div>
        </div>

        {/* --- CARTE 2 : PROTOCOLE --- */}
        <div className="bg-white/60 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[24px] shadow-lg shadow-slate-200/40 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-sm ring-2 ring-white/50"></div>
             <p className="text-xs font-bold uppercase tracking-wide text-slate-900">
               Protocole de qualité
             </p>
          </div>

          <ul className="text-[13px] text-slate-600 space-y-4 relative pl-2 font-medium text-left">
            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-slate-300"></div>
            
            <li className="pl-4 relative">
                <span className="absolute left-0 top-2.5 w-1.5 h-[1px] bg-slate-400"></span>
                Répondez seul(e), sans distraction
            </li>
            <li className="pl-4 relative">
                <span className="absolute left-0 top-2.5 w-1.5 h-[1px] bg-slate-400"></span>
                Soyez factuel, ne surestimez pas
            </li>
            <li className="pl-4 relative">
                <span className="absolute left-0 top-2.5 w-1.5 h-[1px] bg-slate-400"></span>
                Ne tentez pas d’anticiper les résultats
            </li>
          </ul>
        </div>

        {/* --- CARTE 3 : ACTION --- */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-5 md:p-6 rounded-[24px] shadow-xl shadow-slate-200/50 space-y-5">
          
          <div className="space-y-1 pl-1 text-left">
             <p className="text-[10px] font-bold uppercase tracking-wider bg-white/50 text-slate-500 inline-block px-2 py-1 rounded-md border border-white/60">
                 Temps estimé : 8-12 min
             </p>
             <p className="text-sm font-medium pl-1 text-slate-800">
                 Une analyse commencée doit être menée à terme.
             </p>
          </div>

          {/* Lien vers le runner OMNI */}
          <Link href="/omni/run" className="block w-full">
            <button
              onClick={handleSessionInit}
              className="w-full py-5 rounded-xl bg-slate-900 text-white text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              LANCER OMNI
            </button>
          </Link>

          <p className="text-[9px] text-center leading-relaxed text-slate-400 px-4 font-medium">
            L’analyse fournit une lecture fonctionnelle du potentiel.
            Elle ne constitue ni un diagnostic médical, ni une prescription.
          </p>
        </div>

      </div>
    </main>
  );
}