'use client';

import Link from 'next/link';
// Imports relatifs pour éviter les erreurs de build
import CycleSyncCalculator from '../../../../components/CycleSyncCalculator';
import { useTranslation } from '../../../../lib/context/LanguageContext';

export default function CycleSyncPage() {
  // On récupère la langue actuelle pour la navigation
  const { language, t } = useTranslation();

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[50vh] md:min-h-screen border-r border-white/5">
        
        <div className="relative z-10">
          {/* Adaptation du lien pour inclure la langue dynamique */}
          <Link 
            href={`/${language}/outils`} 
            className="inline-flex items-center text-white/40 hover:text-white text-[10px] mb-12 transition-colors uppercase tracking-[0.2em] font-bold"
          >
            <span className="mr-2">←</span> {t.common?.backToTools || "Retour aux outils"}
          </Link>
          
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
            Optimisation Hormonale
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.85] mb-10" style={{ fontFamily: 'var(--font-azonix)' }}>
            CYCLE<br />SYNC
          </h1>
          
          <div className="space-y-10">
            
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              Synchronisez nutrition et training avec vos fluctuations hormonales pour une performance et des résultats optimaux.
            </p>

            {/* Physiologie */}
            <div className="space-y-6">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Physiologie du Cycle</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Phase Folliculaire (J6-14)</div>
                <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                  Œstrogène ⬆️ : Sensibilité insuline maximale, force musculaire au pic, récupération rapide.
                </p>
                <div className="text-white/50 text-[10px]">
                  ✅ Volume training max (+20-30%)
                  <br />✅ Glucides élevés (tolérance optimale)
                  <br />✅ Fenêtre anabolique idéale
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Phase Lutéale (J15-28)</div>
                <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                  Progestérone ⬆️ : BMR +5-10%, sensibilité insuline réduite, appétit accru.
                </p>
                <div className="text-white/50 text-[10px]">
                  ⚠️ Calories +100-250 kcal (métabolisme ⬆️)
                  <br />⚠️ Glucides réduits, lipides augmentés
                  <br />⚠️ Volume training réduit (-20-30%)
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Rétention d'Eau</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Phase lutéale tardive: +1-3kg eau (progestérone). Ne pas se peser J24-28. Poids stable revient J1-5.
                </p>
              </div>
            </div>

            {/* Bénéfices */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="mb-4">
                <div className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold mb-3">Impact Synchronisation</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#DAFA72]">✓</span>
                    <span className="text-white/60 text-[10px]">Performance training +15-25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#DAFA72]">✓</span>
                    <span className="text-white/60 text-[10px]">Récupération optimisée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#DAFA72]">✓</span>
                    <span className="text-white/60 text-[10px]">Adhésion nutrition +40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#DAFA72]">✓</span>
                    <span className="text-white/60 text-[10px]">Réduction symptômes PMS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Références */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Références:</span>
                <br />Davidsen et al. (2007) - Muscle Strength
                <br />Oosthuyse & Bosch (2010) - Metabolic Response
                <br />Chidi-Ogbolu & Baar (2019) - Estrogen Effects
                <br />Janse de Jonge (2003) - Exercise Performance
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold flex justify-between">
          <span>GENESIS LAB V1.0</span>
          <span>CYCLE SYNC</span>
        </div>

        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DAFA72] rounded-full blur-[140px] opacity-[0.07] pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 bg-white relative overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full">
            <CycleSyncCalculator />
          </div>
        </div>
      </section>
      
    </main>
  );
}