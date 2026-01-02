'use client';

import Link from 'next/link';
import CycleSyncCalculator from '@/components/CycleSyncCalculator';
import { Moon, ArrowLeft } from 'lucide-react';

export default function CycleSyncPage() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Moon className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          {/* Back Link */}
          <Link 
            href="/outils" 
            className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au Hub
          </Link>
          
          {/* Header identique à la carte Hub : Icone + Badge Type */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                {/* ICONE CARRÉE GRADIENT (Purple pour Cycle Sync) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] flex items-center justify-center text-white">
                   <Moon className="w-7 h-7 stroke-[1.5]" />
                </div>
                
                {/* BADGE TYPE */}
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Protocole Hormonal féminin
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 03
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Cycle Sync
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Synchronisez nutrition et training avec vos fluctuations hormonales pour une performance et des résultats optimaux.
            </p>

            {/* INFO BOX 1: Folliculaire */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Phase Folliculaire</span>
                    <span className="text-white/60 font-mono text-[10px]">J6-14</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed mb-2">
                   Œstrogène ⬆️ : Sensibilité insuline maximale, force au pic.
                 </p>
                 <ul className="text-white/30 text-[10px] space-y-1 list-disc pl-3">
                    <li>Volume training max (+20-30%)</li>
                    <li>Glucides élevés tolérés</li>
                 </ul>
            </div>

            {/* INFO BOX 2: Lutéale */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Phase Lutéale</span>
                    <span className="text-white/60 font-mono text-[10px]">J15-28</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed mb-2">
                   Progestérone ⬆️ : Métabolisme +5-10%, sensibilité insuline ⬇️.
                 </p>
                 <ul className="text-white/30 text-[10px] space-y-1 list-disc pl-3">
                    <li>Calories +100-250 kcal</li>
                    <li>Glucides réduits, Lipides ⬆️</li>
                 </ul>
            </div>

            {/* References Mini */}
            <div className="text-[9px] text-white/20 pt-4 border-t border-white/5 uppercase tracking-wider">
                Ref: Davidsen (2007) • Oosthuyse (2010)
            </div>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors cursor-default">
            Initialiser
          </p>
          <span className="font-azonix text-xs opacity-30">V1.0</span>
        </div>
      </section>

      {/* SECTION DROITE (CONTENU) */}
      <section className="flex-1 bg-white relative overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full">
            {/* Le composant importé conserve sa logique interne */}
            <CycleSyncCalculator />
          </div>
        </div>
      </section>
      
    </main>
  );
}