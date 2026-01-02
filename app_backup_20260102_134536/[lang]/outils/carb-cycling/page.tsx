'use client';

import { useState } from 'react';
import Link from 'next/link';

type Protocol = '2/1' | '3/1' | '4/1';
type Goal = 'fatloss' | 'recomp' | 'performance';

export default function CarbCyclingPage() {
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protocol, setProtocol] = useState<Protocol>('3/1');
  const [goal, setGoal] = useState<Goal>('fatloss');

  const [result, setResult] = useState<{
    low: { p: number; f: number; c: number; kcal: number };
    high: { p: number; f: number; c: number; kcal: number };
    days: { low: number; high: number };
    weeklyAvg: number;
    weeklyDeficit: number;
  } | null>(null);

  const calculateCycle = () => {
    const p = parseFloat(protein);
    const f = parseFloat(fats);
    const c_m = parseFloat(carbs);

    if (!p || !f || !c_m) return;

    // Protocole: jours bas/hauts
    let daysLow = 3, daysHigh = 1;
    if (protocol === '2/1') { daysLow = 2; daysHigh = 1; }
    if (protocol === '4/1') { daysLow = 4; daysHigh = 1; }

    // ========================================
    // STRATÉGIE SELON OBJECTIF
    // ========================================
    
    let p_low, f_low, c_low;
    let p_high, f_high, c_high;

    if (goal === 'fatloss') {
      // FAT LOSS: Déficit global -300 kcal/jour moyen
      // Jour bas: -400-500 kcal
      // Jour haut: -100-200 kcal
      
      p_low = Math.round(p * 1.1);  // +10% protéines (anti-catabolisme)
      f_low = Math.round(f * 1.25); // +25% lipides (satiété)
      c_low = Math.round(c_m * 0.40); // -60% glucides
      
      p_high = p; // maintenance
      f_high = Math.round(f * 0.85); // -15% lipides
      c_high = Math.round(c_m * 1.30); // +30% glucides
      
    } else if (goal === 'recomp') {
      // RECOMP: Maintenance moyenne
      // Jour bas: -200 kcal
      // Jour haut: +600 kcal (sur 1 jour = +150 kcal moyen sur 4 jours)
      
      p_low = Math.round(p * 1.05);
      f_low = Math.round(f * 1.20);
      c_low = Math.round(c_m * 0.60); // -40%
      
      p_high = p;
      f_high = f;
      c_high = Math.round(c_m * 1.50); // +50%
      
    } else {
      // PERFORMANCE: Surplus léger jours training
      // Jour bas: maintenance -100
      // Jour haut: +400 kcal
      
      p_low = p;
      f_low = Math.round(f * 1.10);
      c_low = Math.round(c_m * 0.70); // -30%
      
      p_high = Math.round(p * 1.05);
      f_high = Math.round(f * 0.90);
      c_high = Math.round(c_m * 1.40); // +40%
    }

    // ========================================
    // CALCULS CALORIQUES
    // ========================================
    
    const kcal_low = (p_low * 4) + (c_low * 4) + (f_low * 9);
    const kcal_high = (p_high * 4) + (c_high * 4) + (f_high * 9);
    
    // Moyenne hebdo
    const totalCycle = daysLow + daysHigh;
    const weeklyKcal = (daysLow * kcal_low) + (daysHigh * kcal_high);
    const weeklyAvg = Math.round(weeklyKcal / totalCycle);
    
    // Maintenance baseline
    const maintenanceKcal = (p * 4) + (c_m * 4) + (f * 9);
    const weeklyDeficit = weeklyAvg - maintenanceKcal;

    setResult({
      low: { p: p_low, f: f_low, c: c_low, kcal: Math.round(kcal_low) },
      high: { p: p_high, f: f_high, c: c_high, kcal: Math.round(kcal_high) },
      days: { low: daysLow, high: daysHigh },
      weeklyAvg,
      weeklyDeficit: Math.round(weeklyDeficit)
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
            Planification Avancée
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-azonix)' }}>
            CARB<br />CYCLING
          </h1>
          
          <div className="space-y-6">
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm">
              Stratégie de manipulation des glucides pour optimiser la composition corporelle sans adaptation métabolique.
            </p>

            {/* Méthodologie */}
            <div className="space-y-3">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Principe Physiologique</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Jours Bas (Repos/Cardio)</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Glucides réduits, lipides augmentés. Favorise l'oxydation des graisses et la sensibilité à l'insuline.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Jours Hauts (Training Intensif)</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Glucides élevés, lipides réduits. Recharge glycogène, boost leptine, performance maximale.
                </p>
              </div>
            </div>

            {/* Exemple Planning */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Exemple 3/1:</span>
                <br />Lun-Mer (bas): Cardio/Haut du corps
                <br />Jeu (haut): Legs/Back intense
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            GENESIS LAB — CARB CYCLING V2.0
          </p>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#DAFA72] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      </section>

      {/* SECTION DROITE */}
      <section className="flex-1 p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-2xl">
          
          <div className="space-y-12">
            
            {/* OBJECTIF SÉLECTION */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Objectif Principal
              </label>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { value: 'fatloss', label: 'Fat Loss' },
                  { value: 'recomp', label: 'Recomp' },
                  { value: 'performance', label: 'Performance' }
                ] as const).map((g) => (
                  <button 
                    key={g.value}
                    onClick={() => { setGoal(g.value); setResult(null); }}
                    className={`py-4 px-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                      goal === g.value
                      ? 'border-[#303030] bg-[#303030] text-white' 
                      : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUTS MACROS */}
            <div className="grid grid-cols-3 gap-6">
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Protéines (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="180"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Lipides (g)
                </label>
                <input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="70"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Glucides Moy. (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="250"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
            </div>

            {/* PROTOCOLE */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Protocole (Jours Bas / Jours Hauts)
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['2/1', '3/1', '4/1'] as const).map((p) => (
                  <button 
                    key={p}
                    onClick={() => { setProtocol(p); setResult(null); }}
                    className={`py-4 px-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                      protocol === p 
                      ? 'border-[#303030] bg-[#303030] text-white' 
                      : 'border-black/10 text-black/40 hover:border-black/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={calculateCycle}
              className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer"
            >
              <span className="relative z-10">Générer le cycle</span>
            </button>

            {/* RÉSULTATS */}
            {result && (
              <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in duration-700">
                
                {/* Métriques Hebdo */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-black/5 border border-black/10">
                    <div className="text-[10px] text-black/40 uppercase tracking-widest mb-1">Moyenne Hebdo</div>
                    <div className="text-2xl font-bold text-[#303030]">{result.weeklyAvg} kcal</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 border border-black/10">
                    <div className="text-[10px] text-black/40 uppercase tracking-widest mb-1">Déficit Moyen</div>
                    <div className={`text-2xl font-bold ${result.weeklyDeficit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {result.weeklyDeficit > 0 ? '+' : ''}{result.weeklyDeficit} kcal
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* JOUR BAS */}
                  <div className="relative p-8 rounded-[24px] border border-black/10 bg-[#FAFAFA]">
                    <div className="absolute top-8 right-8 text-[10px] font-bold text-black/20 uppercase tracking-widest">
                      {result.days.low} JOURS
                    </div>
                    <h3 className="text-[#303030] text-sm font-bold uppercase tracking-widest mb-8">JOUR BAS</h3>
                    
                    <div className="mb-8">
                      <span className="text-5xl text-[#303030] font-light tracking-tight">{result.low.kcal}</span>
                      <span className="text-xs text-black/40 ml-2 uppercase font-medium">Kcal</span>
                    </div>

                    <div className="space-y-4 text-sm border-t border-black/5 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-black/40 text-xs uppercase tracking-wider">Protéines</span>
                        <span className="font-medium text-[#303030]">{result.low.p}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#EDEDED] -mx-2 px-2 py-2 rounded-lg">
                        <span className="text-[#303030] text-xs uppercase tracking-wider font-bold">Glucides</span>
                        <span className="font-bold text-[#303030]">{result.low.c}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/40 text-xs uppercase tracking-wider">Lipides</span>
                        <span className="font-medium text-[#303030]">{result.low.f}g</span>
                      </div>
                    </div>
                  </div>

                  {/* JOUR HAUT */}
                  <div className="relative p-8 rounded-[24px] bg-[#303030] text-white shadow-xl border border-[#DAFA72]/20">
                    <div className="absolute top-8 right-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      {result.days.high} JOUR
                    </div>
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-8">JOUR HAUT</h3>
                    
                    <div className="mb-8">
                      <span className="text-5xl text-[#DAFA72] font-light tracking-tight">{result.high.kcal}</span>
                      <span className="text-xs text-white/40 ml-2 uppercase font-medium">Kcal</span>
                    </div>

                    <div className="space-y-4 text-sm border-t border-white/10 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Protéines</span>
                        <span className="font-medium text-white">{result.high.p}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#DAFA72] -mx-2 px-2 py-2 rounded-lg">
                        <span className="text-[#303030] text-xs uppercase tracking-wider font-bold">Glucides</span>
                        <span className="text-[#303030] font-bold">{result.high.c}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider">Lipides</span>
                        <span className="font-medium text-white">{result.high.f}g</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}