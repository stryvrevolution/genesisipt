'use client';

import Link from 'next/link';
import CycleSyncCalculator from '@/components/CycleSyncCalculator';
import { Moon, ArrowLeft } from 'lucide-react';

export default function CycleSyncPage() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
      
      {/* ================= GAUCHE ================= */}
      <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
        
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Moon className="w-80 h-80 stroke-[0.5]" />
        </div>

        <div className="relative z-10">
          <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
          </Link>
          
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] flex items-center justify-center text-white">
                   <Moon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Hormonal Féminin</span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 03
            </div>
          </div>
          
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Cycle Sync
          </h1>
          
          {/* DESCRIPTION SCIENTIFIQUE */}
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div>
              <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">Optimisation Hormonale Cyclique</h2>
              <p className="text-white/50 text-[13px] leading-relaxed font-light">
                Protocole d'entraînement et nutrition synchronisé avec les 4 phases du cycle menstruel. Maximisez performance, récupération et composition corporelle via modulation hormonale naturelle.
              </p>
            </div>

            <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
              <p>Physiologie des fluctuations hormonales :</p>
              
              <div className="space-y-2 pl-4 border-l-2 border-purple-500/30">
                <p><strong className="text-white/70">• Phase Folliculaire (J1-14)</strong> : Œstrogène ↑↑. Sensibilité insuline maximale, force pic, récupération rapide (Davidsen 2007).</p>
                <p><strong className="text-white/70">• Ovulation (J14-15)</strong> : Pic LH/FSH. Testostérone relative ↑, anabolisme optimal 24-48h (Janse de Jonge 2003).</p>
                <p><strong className="text-white/70">• Phase Lutéale (J15-28)</strong> : Progestérone ↑. Métabolisme +5-10%, température ↑0.3-0.5°C, sensibilité insuline ↓ (Oosthuyse 2010).</p>
                <p><strong className="text-white/70">• Menstruation (J1-5)</strong> : Hormones nadir. Inflammation ↑, fatigue, récupération ralentie (Bruinvels 2016).</p>
              </div>

              <p className="pt-2">
                <strong className="text-white/90">Ajustements training/nutrition</strong> : Volume ±30%, Glucides ±40%, Calories totales ±250 kcal selon phase pour homéostasie hormonale.
              </p>

              <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                Références : Davidsen (2007) • Janse de Jonge (2003) • Oosthuyse & Bosch (2010) • Bruinvels (2016)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">STRYV Lab</p>
          <span className="font-azonix text-xs opacity-30">V3.0</span>
        </div>
      </section>

      {/* ================= DROITE : COMPONENT ================= */}
      <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
        <div className="max-w-4xl mx-auto">
          <CycleSyncCalculator />
        </div>
      </section>
      
    </main>
  );
}