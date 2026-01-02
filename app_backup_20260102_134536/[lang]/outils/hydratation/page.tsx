'use client';

import { useState } from 'react';
import Link from 'next/link';

type Activity = 'sedentary' | 'light' | 'moderate' | 'intense' | 'athlete';
type Climate = 'cold' | 'temperate' | 'hot' | 'veryHot';
type Gender = 'male' | 'female';

export default function HydratationPage() {
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activity, setActivity] = useState<Activity>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  
  const [result, setResult] = useState<{
    liters: number;
    glasses: number;
    breakdown: { base: number; activity: number; climate: number; gender: number };
    warnings: string[];
  } | null>(null);

  const calculateIntake = () => {
    const w = parseFloat(weight);
    if (!w) return;

    // ========================================
    // 1. BASE HYDRIQUE (35ml/kg)
    // ========================================
    const baseML = w * 35;

    // ========================================
    // 2. AJUSTEMENT GENRE
    // ========================================
    const genderMultiplier = gender === 'male' ? 1.1 : 0.95;
    const genderAdjustedBase = baseML * genderMultiplier;
    const genderBonus = Math.round(genderAdjustedBase - baseML);

    // ========================================
    // 3. BONUS ACTIVITÉ (Calibré)
    // ========================================
    const activityBonus: Record<Activity, number> = {
      sedentary: 0,      // <30min/jour
      light: 300,        // 30-60min léger
      moderate: 600,     // 60-90min modéré
      intense: 900,      // 90-120min intense
      athlete: 1200,     // >120min ou 2x/jour
    };

    // ========================================
    // 4. BONUS CLIMAT (Optimisé)
    // ========================================
    const climateBonus: Record<Climate, number> = {
      cold: 500,         // Diurèse froid + air sec
      temperate: 0,      // Neutre
      hot: 750,          // Sudation modérée (25-30°C)
      veryHot: 1500,     // Sudation intense (>30°C)
    };

    // ========================================
    // 5. TOTAL
    // ========================================
    const totalML = genderAdjustedBase + activityBonus[activity] + climateBonus[climate];
    const totalLiters = Math.round((totalML / 1000) * 10) / 10;
    const glasses = Math.round(totalML / 250);

    // ========================================
    // 6. WARNINGS PHYSIOLOGIQUES
    // ========================================
    const warnings: string[] = [];

    if (totalLiters > 5) {
      warnings.push('⚠️ Volume élevé (>5L): Risque d\'hyponatrémie si ingestion trop rapide. Répartir sur la journée.');
    }

    if (totalLiters < 1.5) {
      warnings.push('⚠️ Volume bas (<1.5L): Déshydratation chronique probable. Augmenter progressivement.');
    }

    if (climate === 'veryHot' && activity === 'athlete') {
      warnings.push('⚠️ Conditions extrêmes: Ajouter électrolytes (sodium 500-700mg/L) pour éviter crampes.');
    }

    if (climate === 'cold') {
      warnings.push('ℹ️ Climat froid: La soif est réduite. Programmer des rappels hydratation toutes les 2h.');
    }

    setResult({
      liters: totalLiters,
      glasses: glasses,
      breakdown: {
        base: Math.round(baseML),
        gender: genderBonus,
        activity: activityBonus[activity],
        climate: climateBonus[climate]
      },
      warnings
    });
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen">
        
        <div className="relative z-10">
          <Link href="/outils" className="inline-flex items-center text-white/40 hover:text-white text-xs mb-12 transition-colors uppercase tracking-widest font-bold">
            ← Retour aux outils
          </Link>
          
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-widest uppercase mb-4">
            Santé & Performance
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-azonix)' }}>
            HYDRA<br />TATION
          </h1>
          
          <div className="space-y-6">
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm">
              Déshydratation de 2% = perte de 20% de performance cognitive et physique. L'hydratation optimale est non-négociable.
            </p>

            {/* Méthodologie */}
            <div className="space-y-3">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Facteurs Physiologiques</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Genre</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Hommes: +10% (masse musculaire). Femmes: -5% (masse grasse supérieure).
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Climat Froid</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Diurèse induite par le froid + air sec hivernal = pertes accrues de 500ml/jour.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Timing Optimal</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Répartir: 500ml au réveil, 200ml/2h pendant journée, 500ml pré/post training.
                </p>
              </div>
            </div>

            {/* Références */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Formule:</span> 35ml/kg base (EFSA 2010)
                <br />
                <span className="font-bold uppercase tracking-wider">Références:</span> ISSN Hydration (2017) · ACSM (2007)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            GENESIS LAB — HYDRATATION V2.0
          </p>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#DAFA72] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-xl">
          
          <div className="space-y-12">
            
            {/* GENRE */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Genre
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: 'male', label: 'Homme' },
                  { val: 'female', label: 'Femme' }
                ].map((opt) => (
                  <button 
                    key={opt.val}
                    onClick={() => { setGender(opt.val as Gender); setResult(null); }}
                    className={`py-3 px-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                      gender === opt.val
                      ? 'border-[#303030] bg-[#303030] text-white' 
                      : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* POIDS */}
            <div className="relative group">
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75"
                className="w-full bg-transparent border-b border-black/10 py-3 text-4xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
              />
            </div>

            {/* ACTIVITÉ */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Niveau d'activité
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { val: 'sedentary', label: 'Sédentaire', desc: '<30min' },
                  { val: 'light', label: 'Léger', desc: '30-60min' },
                  { val: 'moderate', label: 'Modéré', desc: '60-90min' },
                  { val: 'intense', label: 'Intense', desc: '90-120min' },
                  { val: 'athlete', label: 'Athlète', desc: '>120min' }
                ].map((opt) => (
                  <button 
                    key={opt.val}
                    onClick={() => { setActivity(opt.val as Activity); setResult(null); }}
                    className={`py-3 px-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all border ${
                      activity === opt.val
                      ? 'border-[#303030] bg-[#303030] text-white' 
                      : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[9px] opacity-60 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CLIMAT */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Environnement / Climat
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { val: 'cold', label: 'Froid', desc: '<10°C' },
                  { val: 'temperate', label: 'Tempéré', desc: '10-25°C' },
                  { val: 'hot', label: 'Chaud', desc: '25-30°C' },
                  { val: 'veryHot', label: 'Extrême', desc: '>30°C' }
                ].map((opt) => (
                  <button 
                    key={opt.val}
                    onClick={() => { setClimate(opt.val as Climate); setResult(null); }}
                    className={`py-3 px-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all border ${
                      climate === opt.val
                      ? 'border-[#303030] bg-[#303030] text-white' 
                      : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[9px] opacity-60 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={calculateIntake}
              disabled={!weight}
              className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">Calculer mes besoins</span>
            </button>

            {/* RÉSULTATS */}
            {result && (
              <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in duration-700">
                
                {/* Principal */}
                <div className="text-center mb-12">
                  <span className="block text-black/40 text-[10px] uppercase tracking-[0.2em] mb-4">
                    Objectif Quotidien
                  </span>
                  <div className="flex items-baseline justify-center gap-2 text-[#303030]">
                    <span className="text-[clamp(5rem,10vw,8rem)] leading-none" style={{ fontFamily: 'var(--font-azonix)' }}>
                      {result.liters}
                    </span>
                    <span className="text-3xl text-[#DAFA72]" style={{ fontFamily: 'var(--font-azonix)' }}>L</span>
                  </div>
                  <p className="mt-4 text-sm text-black/40">
                    Soit environ <span className="text-[#303030] font-bold">{result.glasses} verres</span> de 250ml par jour
                  </p>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5">
                    <span className="block text-[9px] uppercase tracking-widest text-black/30 mb-1">Base</span>
                    <span className="text-lg text-[#303030] font-bold">{result.breakdown.base}ml</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5">
                    <span className="block text-[9px] uppercase tracking-widest text-black/30 mb-1">Genre</span>
                    <span className="text-lg text-[#303030] font-bold">{result.breakdown.gender > 0 ? '+' : ''}{result.breakdown.gender}ml</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5">
                    <span className="block text-[9px] uppercase tracking-widest text-black/30 mb-1">Activité</span>
                    <span className="text-lg text-[#303030] font-bold">+{result.breakdown.activity}ml</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5">
                    <span className="block text-[9px] uppercase tracking-widest text-black/30 mb-1">Climat</span>
                    <span className="text-lg text-[#303030] font-bold">+{result.breakdown.climate}ml</span>
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-[11px] text-amber-800 font-medium">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}