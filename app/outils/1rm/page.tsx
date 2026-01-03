'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, ArrowLeft } from 'lucide-react';

type Formula = 'brzycki' | 'epley' | 'lombardi' | 'average';
type Unit = 'kg' | 'lbs';

export default function RMCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [formula, setFormula] = useState<Formula>('average');
  const [unit, setUnit] = useState<Unit>('kg');
  
  const [result, setResult] = useState<{
    oneRM: number;
    brzycki: number;
    epley: number;
    lombardi: number;
    warnings: string[];
  } | null>(null);

  // ========================================
  // FORMULES 1RM
  // ========================================
  const calculateBrzycki = (w: number, r: number): number => w / (1.0278 - 0.0278 * r);
  const calculateEpley = (w: number, r: number): number => w * (1 + 0.0333 * r);
  const calculateLombardi = (w: number, r: number): number => w * Math.pow(r, 0.1);

  // ========================================
  // LOGIQUE DE CALCUL
  // ========================================
  const calculateRM = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (!w || !r) return;

    const brzycki = calculateBrzycki(w, r);
    const epley = calculateEpley(w, r);
    const lombardi = calculateLombardi(w, r);
    const average = (brzycki + epley + lombardi) / 3;

    let selectedRM: number;
    if (formula === 'average') selectedRM = average;
    else if (formula === 'epley') selectedRM = epley;
    else if (formula === 'lombardi') selectedRM = lombardi;
    else selectedRM = brzycki;

    const warnings: string[] = [];
    if (r === 1) warnings.push('ℹ️ 1 répétition = déjà votre 1RM.');
    if (r > 10) warnings.push('⚠️ >10 reps: Précision réduite (±10-15%).');
    if (r > 15) warnings.push('⚠️ >15 reps: Estimation 1RM très imprécise.');

    setResult({ oneRM: selectedRM, brzycki, epley, lombardi, warnings });
  };

  const displayWeight = (w: number): string => {
    const converted = unit === 'lbs' ? w * 2.20462 : w;
    return unit === 'kg' ? `${Math.round(converted * 2) / 2}` : `${Math.round(converted)}`;
  };

  // Zones calculées à la volée
  const trainingZones = result ? [
    { intensity: 100, weight: result.oneRM, reps: "1", objective: "Test 1RM / Compétition", color: "border-red-500/20 text-red-700 bg-red-50" },
    { intensity: 95, weight: result.oneRM * 0.95, reps: "1-2", objective: "Force Maximale", color: "border-orange-500/20 text-orange-700 bg-orange-50" },
    { intensity: 90, weight: result.oneRM * 0.90, reps: "2-4", objective: "Force", color: "border-orange-400/20 text-orange-600 bg-orange-50/50" },
    { intensity: 85, weight: result.oneRM * 0.85, reps: "4-6", objective: "Force / Hypertrophie", color: "border-yellow-500/20 text-yellow-800 bg-yellow-50" },
    { intensity: 80, weight: result.oneRM * 0.80, reps: "6-8", objective: "Hypertrophie", color: "border-emerald-500/20 text-emerald-700 bg-emerald-50" },
    { intensity: 75, weight: result.oneRM * 0.75, reps: "8-10", objective: "Hypertrophie", color: "border-emerald-400/20 text-emerald-600 bg-emerald-50/50" },
    { intensity: 70, weight: result.oneRM * 0.70, reps: "10-12", objective: "Hypertrophie / Endurance", color: "border-blue-500/20 text-blue-700 bg-blue-50" },
    { intensity: 65, weight: result.oneRM * 0.65, reps: "12-15", objective: "Endurance Musculaire", color: "border-blue-400/20 text-blue-600 bg-blue-50/50" },
    { intensity: 50, weight: result.oneRM * 0.50, reps: "20+", objective: "Échauffement / Technique", color: "border-slate-300 text-slate-600 bg-slate-50" },
  ] : [];

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <Dumbbell className="w-80 h-80 stroke-[0.5]" />
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
                {/* ICONE CARRÉE GRADIENT (Jaune pour Charges) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_20px_-5px_rgba(250,204,21,0.4)] flex items-center justify-center text-white">
                   <Dumbbell className="w-7 h-7 stroke-[1.5]" />
                </div>
                
                {/* BADGE TYPE */}
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Charges
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 07
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            1RM Calculator
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Déterminez votre charge maximale théorique (1RM) et générez vos zones d'intensité précises pour optimiser votre périodisation via les formules Brzycki, Epley et Lombardi.
            </p>

            {/* Info Box */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Précision</span>
                    <span className="text-white/60 font-mono text-[10px]">±2.5%</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed">
                   Résultats optimaux pour des séries de 3 à 8 répétitions.
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
              {/* Note: Flex-col pour mobile (une ligne par question), md:flex-row pour desktop */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end">
                
                {/* Poids */}
                <div className="relative flex-1 group w-full">
                  <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                    Charge ({unit})
                  </label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    placeholder="ex: 80" 
                    className="w-full bg-transparent border-b border-black/10 py-4 text-4xl text-[#303030] font-light outline-none focus:border-[#1A1A1A] transition-all placeholder:text-black/5" 
                  />
                </div>

                {/* Reps */}
                <div className="relative flex-1 group w-full">
                  <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                    Répétitions
                  </label>
                  <input 
                    type="number" 
                    value={reps} 
                    onChange={(e) => setReps(e.target.value)} 
                    placeholder="ex: 6" 
                    className="w-full bg-transparent border-b border-black/10 py-4 text-4xl text-[#303030] font-light outline-none focus:border-[#1A1A1A] transition-all placeholder:text-black/5" 
                  />
                </div>

                {/* Unit Switch */}
                <div className="bg-[#F5F5F5] p-1 rounded-lg flex items-center mb-2">
                    {(['kg', 'lbs'] as Unit[]).map((u) => (
                      <button 
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                          unit === u 
                          ? 'bg-white shadow-sm text-[#303030]' 
                          : 'text-black/30 hover:text-black/60'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                </div>
              </div>

              {/* Formula Selection */}
              <div>
                 <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold opacity-40">
                   Algorithme
                 </label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'average', label: 'Moyenne' },
                    { id: 'brzycki', label: 'Brzycki' },
                    { id: 'epley', label: 'Epley' },
                    { id: 'lombardi', label: 'Lombardi' }
                  ].map((f) => (
                    <button 
                      key={f.id} 
                      onClick={() => setFormula(f.id as Formula)} 
                      className={`px-4 py-3 rounded-xl text-[11px] font-medium border transition-all ${
                        formula === f.id 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'border-black/5 text-black/40 hover:border-black/20 hover:text-black/60 bg-transparent'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            
              {/* Action Button */}
              <button 
                onClick={calculateRM} 
                disabled={!weight || !reps} 
                className="w-full group relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)]"
              >
                <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
                  Calculer
                </span>
              </button>
            </div>

            {/* RESULTS DISPLAY */}
            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full h-px bg-black/5 mb-12" />

                {/* Main Card (Premium Black) */}
                <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-10 text-center shadow-2xl mb-12 group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
                  
                  <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
                    Estimation 1RM ({formula})
                  </h3>
                  
                  <div className="relative flex items-baseline justify-center gap-2">
                    <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                      {displayWeight(result.oneRM)}
                    </span>
                    <span className="text-xl font-medium text-white/30 uppercase tracking-widest">
                      {unit}
                    </span>
                  </div>

                  {formula === 'average' && (
                    <div className="relative mt-8 flex flex-wrap justify-center gap-4 text-[10px] text-white/30 font-mono">
                      <span>Brzycki: {displayWeight(result.brzycki)}</span>
                      <span>•</span>
                      <span>Epley: {displayWeight(result.epley)}</span>
                      <span>•</span>
                      <span>Lombardi: {displayWeight(result.lombardi)}</span>
                    </div>
                  )}
                </div>

                {/* Training Zones Table */}
                <div className="space-y-6">
                  <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 pl-2">
                    Zones d'entraînement
                  </h3>
                  
                  <div className="grid gap-3">
                    {trainingZones.map((zone, i) => (
                      <div 
                        key={i} 
                        className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${zone.color}`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-sm font-bold shadow-sm">
                            {zone.intensity}%
                          </div>
                          <div>
                            <div className="font-bold text-[13px] uppercase tracking-wide leading-tight mb-1 text-[#303030]">
                              {zone.objective}
                            </div>
                            <div className="text-[11px] opacity-60 font-medium text-[#303030]">
                              ~{zone.reps} reps
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-2xl font-bold tracking-tight text-[#303030]">
                            {displayWeight(zone.weight)}
                          </span>
                          <span className="text-[9px] uppercase font-bold opacity-40 ml-1 text-[#303030]">
                            {unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="mt-8 bg-orange-50 border border-orange-100 p-4 rounded-xl">
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-[11px] text-orange-600 font-medium flex items-center gap-2">
                        {w}
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