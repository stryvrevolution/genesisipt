'use client';

import { useState } from 'react';
import Link from 'next/link';

type Formula = 'brzycki' | 'epley' | 'lombardi' | 'average';
type Unit = 'kg' | 'lbs';

export default function RMCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [formula, setFormula] = useState<Formula>('brzycki');
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
  // FONCTION PRINCIPALE
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

  const trainingZones = result ? [
    { intensity: 100, weight: result.oneRM, reps: "1", objective: "Test 1RM / Compétition", color: "bg-red-50 text-red-700 border-red-200" },
    { intensity: 95, weight: result.oneRM * 0.95, reps: "1-2", objective: "Force Maximale", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { intensity: 90, weight: result.oneRM * 0.90, reps: "2-4", objective: "Force", color: "bg-orange-50/60 text-orange-600 border-orange-100" },
    { intensity: 85, weight: result.oneRM * 0.85, reps: "4-6", objective: "Force / Hypertrophie", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { intensity: 80, weight: result.oneRM * 0.80, reps: "6-8", objective: "Hypertrophie", color: "bg-green-50 text-green-700 border-green-200" },
    { intensity: 75, weight: result.oneRM * 0.75, reps: "8-10", objective: "Hypertrophie", color: "bg-green-50/60 text-green-600 border-green-100" },
    { intensity: 70, weight: result.oneRM * 0.70, reps: "10-12", objective: "Hypertrophie / Endurance", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { intensity: 65, weight: result.oneRM * 0.65, reps: "12-15", objective: "Endurance Musculaire", color: "bg-blue-50/60 text-blue-600 border-blue-100" },
    { intensity: 50, weight: result.oneRM * 0.50, reps: "20+", objective: "Échauffement / Technique", color: "bg-slate-50 text-slate-600 border-slate-200" },
  ] : [];

  const displayWeight = (w: number): string => {
    const converted = unit === 'lbs' ? w * 2.20462 : w;
    return unit === 'kg' ? `${Math.round(converted * 2) / 2}` : `${Math.round(converted)}`;
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[40vh] md:min-h-screen relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/outils" className="text-white/40 hover:text-white text-[10px] mb-12 inline-block uppercase tracking-[0.2em] font-bold transition-colors">
            ← Hub Outils
          </Link>
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Utilitaire Force</div>
          <h1 className="text-white text-5xl md:text-6xl leading-[0.85] font-azonix italic mb-10" style={{ fontFamily: 'var(--font-azonix)' }}>1RM<br />CALC</h1>
          <div className="space-y-6 text-white/60 text-xs font-light leading-relaxed max-w-sm">
            <p>Estimez votre charge maximale théorique et générez vos zones de travail basées sur les meilleures formules scientifiques.</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
               <div className="flex justify-between items-center"><span className="uppercase tracking-widest text-[9px] font-bold">Précision</span><span className="text-[#DAFA72] font-mono text-xs">±2.5%</span></div>
               <div className="h-[1px] w-full bg-white/10"></div>
               <p className="italic text-[10px]">Optimal pour des séries de 3 à 8 répétitions.</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold flex justify-between">
          <span>DNA PROTOCOLE V2.0</span><span>STRYV LAB</span>
        </div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#DAFA72] rounded-full blur-[140px] opacity-[0.07] pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 p-8 md:p-16 lg:p-24 bg-white overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-12">
          {/* CONFIGURATION */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Charge ({unit})</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="80" className="w-full bg-transparent border-b border-black/10 py-3 text-4xl font-light focus:border-[#DAFA72] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Répétitions</label>
                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="6" className="w-full bg-transparent border-b border-black/10 py-3 text-4xl font-light focus:border-[#DAFA72] outline-none transition-all" />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                {['brzycki', 'epley', 'average'].map((f) => (
                  <button key={f} onClick={() => setFormula(f as Formula)} className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all ${formula === f ? 'bg-black text-white border-black' : 'border-black/10 text-black/40 hover:border-black/20'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')} className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black">
                Unit: {unit.toUpperCase()}
              </button>
            </div>

            <button onClick={calculateRM} disabled={!weight || !reps} className="w-full py-5 rounded-full bg-[#1A1A1A] text-white text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[#DAFA72] hover:text-black transition-all">
              Calculer le 1RM
            </button>
          </div>

          {/* RÉSULTATS */}
          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
              <div className="relative p-10 rounded-[24px] bg-[#1A1A1A] text-white shadow-2xl text-center">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4 font-azonix">Estimation 1RM</h3>
                <div className="text-7xl font-light tracking-tighter text-[#DAFA72] mb-2">
                  {displayWeight(result.oneRM)}<span className="text-2xl ml-2 text-white/30">{unit}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Programmation par zones</h3>
                {trainingZones.map((zone, i) => (
                  <div key={i} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${zone.color}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/80 border border-black/5 flex items-center justify-center text-[11px] font-bold text-[#303030]">
                          {zone.intensity}%
                        </div>
                        <div>
                          <div className="font-bold text-sm uppercase tracking-wide text-[#303030] leading-tight">{zone.objective}</div>
                          <div className="text-[10px] opacity-60 mt-1 italic">{zone.reps} reps suggérées</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1A1A1A] leading-none">{displayWeight(zone.weight)}</div>
                        <div className="text-[9px] uppercase font-bold opacity-30 tracking-widest">{unit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}