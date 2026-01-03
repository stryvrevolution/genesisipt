'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Droplet, ArrowLeft } from 'lucide-react';

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
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Droplet className="w-80 h-80 stroke-[0.5]" />
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
          
          {/* Header identique à la carte Hub */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <div className="flex items-center gap-4">
                {/* ICONE CARRÉE GRADIENT (Cyan pour Eau) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)] flex items-center justify-center text-white">
                   <Droplet className="w-7 h-7 stroke-[1.5]" />
                </div>
                
                {/* BADGE TYPE */}
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Santé & Performance
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 05
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Hydratation
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Une déshydratation de 2% entraîne une baisse de 20% des performances. Calculez vos besoins précis selon votre profil et votre environnement.
            </p>

            {/* Info Box */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Base Physiologique</span>
                    <span className="text-white/60 font-mono text-[10px]">35ml/kg</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed">
                   Ajusté dynamiquement selon l'activité physique (+300 à +1200ml) et le climat (+500 à +1500ml).
                 </p>
            </div>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-white transition-colors cursor-default">
            Initialiser
          </p>
          <span className="font-azonix text-xs opacity-30">V2.0</span>
        </div>
      </section>

      {/* SECTION DROITE (CONTENU) */}
      <section className="flex-1 bg-white relative overflow-y-auto">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-center p-8 md:p-16 lg:p-24">
          
          <div className="w-full space-y-16">
            
            {/* INPUTS */}
            <div className="space-y-10">
              
              {/* Genre & Poids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
                {/* GENRE */}
                <div>
                  <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                    Genre
                  </label>
                  <div className="flex gap-4 border-b border-black/5 pb-4">
                    <button 
                      onClick={() => { setGender('male'); setResult(null); }}
                      className={`flex-1 flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                        gender === 'male' 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Homme</span>
                    </button>
                    <button 
                      onClick={() => { setGender('female'); setResult(null); }}
                      className={`flex-1 flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                        gender === 'female' 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Femme</span>
                    </button>
                  </div>
                </div>

                {/* POIDS */}
                <div className="relative group w-full pb-4">
                   <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Poids (kg)</label>
                   <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="ex: 75" className="w-full bg-transparent border-b border-black/10 py-2 text-3xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" />
                </div>
              </div>

              {/* Activité */}
              <div>
                <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold opacity-40">
                  Niveau d'activité (Journalier)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { val: 'sedentary', label: 'Sédentaire', desc: '<30min' },
                    { val: 'light', label: 'Léger', desc: '30-60min' },
                    { val: 'moderate', label: 'Modéré', desc: '60-90min' },
                    { val: 'intense', label: 'Intense', desc: '90-120min' },
                    { val: 'athlete', label: 'Athlète', desc: '>2h' }
                  ].map((opt) => (
                    <button 
                      key={opt.val}
                      onClick={() => { setActivity(opt.val as Activity); setResult(null); }}
                      className={`p-3 rounded-xl text-left border transition-all duration-300 hover:scale-[1.02] ${
                        activity === opt.val
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'bg-white text-black/40 border-black/5 hover:border-black/20 hover:text-black/60'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1">{opt.label}</div>
                      <div className="text-[9px] opacity-60">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Climat */}
              <div>
                <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold opacity-40">
                  Environnement
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
                      className={`p-3 rounded-xl text-left border transition-all duration-300 hover:scale-[1.02] ${
                        climate === opt.val
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'bg-white text-black/40 border-black/5 hover:border-black/20 hover:text-black/60'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1">{opt.label}</div>
                      <div className="text-[9px] opacity-60">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={calculateIntake} 
                disabled={!weight} 
                className="w-full group relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)]"
              >
                <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
                  Calculer
                </span>
              </button>
            </div>

            {/* RÉSULTATS */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full h-px bg-black/5 mb-12" />

                {/* Main Card (Premium Black) */}
                <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-8 md:p-10 text-center shadow-2xl mb-12 group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 to-transparent opacity-40" />
                  
                  <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
                    Besoin Quotidien
                  </h3>
                  
                  <div className="relative flex items-baseline justify-center gap-2 mb-8">
                    <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                      {result.liters}
                    </span>
                    <span className="text-2xl font-medium text-white/30 uppercase tracking-widest">
                      Litres
                    </span>
                  </div>
                  
                  <p className="relative text-white/40 text-[11px] uppercase tracking-widest mb-8">
                     ~{result.glasses} verres de 250ml
                  </p>

                  {/* Breakdown Grid inside Card */}
                  <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-6">
                     <div className="text-center">
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Base</div>
                        <div className="text-sm font-bold text-white">{result.breakdown.base} ml</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Genre</div>
                        <div className="text-sm font-bold text-white">{result.breakdown.gender > 0 ? '+' : ''}{result.breakdown.gender} ml</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Activité</div>
                        <div className="text-sm font-bold text-white">+{result.breakdown.activity} ml</div>
                     </div>
                     <div className="text-center">
                        <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Climat</div>
                        <div className="text-sm font-bold text-white">+{result.breakdown.climate} ml</div>
                     </div>
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-[11px] text-blue-800 font-medium flex items-center gap-2 mb-1 last:mb-0">
                         <span dangerouslySetInnerHTML={{ __html: w }} />
                      </p>
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