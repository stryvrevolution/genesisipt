'use client';

import Link from 'next/link';
import MacroCalculator from '@/components/MacroCalculator';

export default function MacrosPage() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[50vh] md:min-h-screen border-r border-white/5">
        
        <div className="relative z-10">
          <Link href="/outils" className="inline-flex items-center text-white/40 hover:text-white text-[10px] mb-12 transition-colors uppercase tracking-[0.2em] font-bold">
            <span className="mr-2">←</span> Retour aux outils
          </Link>
          
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
            Calculateur Forensic
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.85] mb-10" style={{ fontFamily: 'var(--font-azonix)' }}>
            MACROS
          </h1>
          
          <div className="space-y-10">
            
            {/* Méthodologie */}
            <div className="space-y-6">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Méthodologie GENESIS</h3>
              
              {/* 01. TDEE */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">01. TDEE Forensic</div>
                <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                  TDEE = BMR + NEAT (pas quotidiens) + EAT (training) + TEF (digestion)
                </p>
                <div className="text-white/50 text-[10px] font-mono">
                  BMR: Katch-McArdle (370 + 21.6×LBM)
                  <br />NEAT: Pas × 0.04 kcal
                  <br />EAT: 200-625 kcal/jour (0-7 workouts)
                </div>
              </div>

              {/* 02. LBM */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">02. Masse Maigre (LBM)</div>
                <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                  Estimation via Boer Formula si BF% inconnu. Protéines calibrées sur LBM (2.2-2.6g/kg) selon objectif.
                </p>
                <div className="text-white/50 text-[10px] font-mono">
                  Homme: (0.407×P) + (0.267×T) - 19.2
                  <br />Femme: (0.252×P) + (0.473×T) - 48.3
                </div>
              </div>

              {/* 03. Stratification */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">03. Stratification Déficit/Surplus</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  5 niveaux adaptatifs selon BF% (12-25% déficit, 100-220 kcal surplus). Protection hormonale via seuils lipides (0.7-0.9g/kg).
                </p>
              </div>
            </div>

            {/* Benchmark */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="mb-4">
                <div className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold mb-3">Benchmark Précision</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-[10px]">GENESIS Forensic</span>
                    <span className="text-[#DAFA72] text-sm font-bold">±150 kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-[10px]">Calculateurs PAL standard</span>
                    <span className="text-white/40 text-sm">±400 kcal</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/5 h-[1px] mb-3" />
              <div className="text-center">
                <span className="text-[#DAFA72] text-lg font-bold">+167%</span>
                <span className="text-white/40 text-[10px] ml-2">Amélioration précision</span>
              </div>
            </div>

            {/* Références */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Références:</span>
                <br />Katch-McArdle BMR (1990)
                <br />Boer LBM Formula (1984)
                <br />ISSN Position Stand (2017)
                <br />Helms et al. Protein Needs (2014)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold flex justify-between">
          <span>GENESIS LAB V2.0</span>
          <span>FORENSIC CALC</span>
        </div>

        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DAFA72] rounded-full blur-[140px] opacity-[0.07] pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 bg-white relative overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full">
            <MacroCalculator />
          </div>
        </div>
      </section>
      
    </main>
  );
}