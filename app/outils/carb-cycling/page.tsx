'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';

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
    maintenance: number;
  } | null>(null);

  const calculateCycle = () => {
    const p = parseFloat(protein);
    const f = parseFloat(fats);
    const c_m = parseFloat(carbs);

    if (!p || !f || !c_m) return;

    let daysLow = 3, daysHigh = 1;
    if (protocol === '2/1') { daysLow = 2; daysHigh = 1; }
    if (protocol === '4/1') { daysLow = 4; daysHigh = 1; }

    let p_low, f_low, c_low;
    let p_high, f_high, c_high;

    if (goal === 'fatloss') {
      p_low = Math.round(p * 1.1);
      f_low = Math.round(f * 1.25);
      c_low = Math.round(c_m * 0.40);
      
      p_high = p;
      f_high = Math.round(f * 0.85);
      c_high = Math.round(c_m * 1.30);
      
    } else if (goal === 'recomp') {
      p_low = Math.round(p * 1.05);
      f_low = Math.round(f * 1.20);
      c_low = Math.round(c_m * 0.60);
      
      p_high = p;
      f_high = f;
      c_high = Math.round(c_m * 1.50);
      
    } else {
      p_low = p;
      f_low = Math.round(f * 1.10);
      c_low = Math.round(c_m * 0.70);
      
      p_high = Math.round(p * 1.05);
      f_high = Math.round(f * 0.90);
      c_high = Math.round(c_m * 1.40);
    }

    const kcal_low = (p_low * 4) + (c_low * 4) + (f_low * 9);
    const kcal_high = (p_high * 4) + (c_high * 4) + (f_high * 9);
    
    const totalCycle = daysLow + daysHigh;
    const weeklyKcal = (daysLow * kcal_low) + (daysHigh * kcal_high);
    const weeklyAvg = Math.round(weeklyKcal / totalCycle);
    
    const maintenanceKcal = Math.round((p * 4) + (c_m * 4) + (f * 9));
    const weeklyDeficit = weeklyAvg - maintenanceKcal;

    setResult({
      low: { p: p_low, f: f_low, c: c_low, kcal: Math.round(kcal_low) },
      high: { p: p_high, f: f_high, c: c_high, kcal: Math.round(kcal_high) },
      days: { low: daysLow, high: daysHigh },
      weeklyAvg,
      weeklyDeficit: Math.round(weeklyDeficit),
      maintenance: maintenanceKcal
    });
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <RefreshCw className="w-80 h-80 stroke-[0.5]" />
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
                {/* ICONE CARRÉE GRADIENT (Orange pour Planification) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] flex items-center justify-center text-white">
                   <RefreshCw className="w-7 h-7 stroke-[1.5]" />
                </div>
                
                {/* BADGE TYPE */}
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Glycogène
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 06
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Carb Cycling
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Stratégie avancée de manipulation des glucides pour optimiser la sensibilité à l'insuline, la perte de gras et la performance sans adaptation métabolique.
            </p>

            {/* Info Box */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Concept</span>
                    <span className="text-white/60 font-mono text-[10px]">High / Low</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed">
                   Alternez jours bas (oxydation des graisses) et jours hauts (recharge glycogène) selon votre fréquence d'entraînement.
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
          
          <div className="w-full space-y-12">
            
            {/* OBJECTIF SÉLECTION */}
            <div>
              <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                Objectif Principal
              </label>
              <div className="grid grid-cols-3 gap-4">
                {([
                  { value: 'fatloss', label: 'Perte' },
                  { value: 'recomp', label: 'Recomp' },
                  { value: 'performance', label: 'Perf' }
                ] as const).map((g) => (
                  <button 
                    key={g.value}
                    onClick={() => { setGoal(g.value); setResult(null); }}
                    className={`py-4 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all border-2 ${
                      goal === g.value
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' 
                      : 'border-black/5 text-black/40 hover:border-black/20 bg-white hover:text-black/70'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUTS MACROS */}
            {/* Grid mobile: 1 col, Desktop: 3 cols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                  Protéines (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="180"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5"
                />
              </div>
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                  Lipides (g)
                </label>
                <input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="70"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5"
                />
              </div>
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                  Glucides Moy. (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="250"
                  className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5"
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
                    className={`py-4 px-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border-2 ${
                      protocol === p 
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg' 
                      : 'border-black/5 text-black/40 hover:border-black/20 bg-white hover:text-black/70'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={calculateCycle}
              disabled={!protein || !fats || !carbs}
              className="group w-full relative overflow-hidden rounded-full bg-[#1A1A1A] p-5 transition-all duration-300 hover:bg-[#DAFA72] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(218,250,114,0.4)]"
            >
              <span className="relative z-10 text-white text-[13px] font-bold uppercase tracking-[0.15em] group-hover:text-[#1A1A1A] transition-colors">
                Générer le cycle
              </span>
            </button>

            {/* RÉSULTATS */}
            {result && (
              <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full h-px bg-black/5 mb-12" />
                
                {/* CARTES INDICATEURS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  
                  {/* Moyenne Hebdo */}
                  <div className="relative overflow-hidden rounded-[24px] border border-blue-100 bg-[#F0F6FF]/60 p-6 flex flex-col justify-between h-full hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1E3A8A] font-bold shadow-sm text-lg">
                                1
                            </div>
                            <div>
                                <h3 className="text-[#1E3A8A] font-extrabold uppercase tracking-wide text-sm leading-tight">Moyenne Hebdo</h3>
                                <p className="text-[#1E3A8A]/60 text-xs font-medium mt-1">Total calorique lissé</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-4xl font-extrabold text-[#1E3A8A] leading-none">{result.weeklyAvg}</span>
                            <span className="text-[10px] text-[#1E3A8A]/50 font-bold tracking-widest uppercase block mt-1">CIBLE</span>
                        </div>
                    </div>
                    {/* Barre du bas */}
                    <div className="bg-blue-100/50 -mx-6 -mb-6 mt-2 px-6 py-3 flex justify-between items-center">
                        <span className="text-[#1E3A8A]/70 text-xs font-medium">Maintenance de base</span>
                        <span className="text-[#1E3A8A] font-bold text-xs">{result.maintenance} kcal</span>
                    </div>
                  </div>

                  {/* Déficit/Surplus */}
                  <div className="relative overflow-hidden rounded-[24px] border border-orange-100 bg-[#FFF7ED]/60 p-6 flex flex-col justify-between h-full hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#9A3412] font-bold shadow-sm text-lg">
                                2
                            </div>
                            <div>
                                <h3 className="text-[#9A3412] font-extrabold uppercase tracking-wide text-sm leading-tight">
                                  {result.weeklyDeficit < 0 ? 'Déficit Moyen' : 'Surplus Moyen'}
                                </h3>
                                <p className="text-[#9A3412]/60 text-xs font-medium mt-1">Delta journalier</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-4xl font-extrabold text-[#9A3412] leading-none">
                                {result.weeklyDeficit > 0 ? '+' : ''}{result.weeklyDeficit}
                            </span>
                            <span className="text-[10px] text-[#9A3412]/50 font-bold tracking-widest uppercase block mt-1">CIBLE</span>
                        </div>
                    </div>
                    {/* Barre du bas */}
                    <div className="bg-orange-100/50 -mx-6 -mb-6 mt-2 px-6 py-3 flex justify-between items-center">
                        <span className="text-[#9A3412]/70 text-xs font-medium">
                          {result.weeklyDeficit < 0 ? 'Perte de gras estimée' : 'Gain estimé'}
                        </span>
                        <div className="flex items-center gap-1 text-[#9A3412] font-bold text-xs">
                           {result.weeklyDeficit < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                           <span>{result.weeklyDeficit < 0 ? 'Active' : 'Actif'}</span>
                        </div>
                    </div>
                  </div>

                </div>

                {/* DETAILS JOURS */}
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* JOUR BAS (Style Light) */}
                  <div className="relative p-8 rounded-[24px] border border-black/10 bg-[#FAFAFA] group">
                    <div className="absolute top-6 right-6 text-[10px] font-bold text-black/20 uppercase tracking-widest border border-black/10 px-2 py-1 rounded-md">
                      {result.days.low} JOURS
                    </div>
                    <h3 className="text-[#303030] text-sm font-bold uppercase tracking-widest mb-8">JOUR BAS</h3>
                    
                    <div className="mb-8">
                      <span className="text-5xl text-[#303030] font-light tracking-tight">{result.low.kcal}</span>
                      <span className="text-xs text-black/40 ml-2 uppercase font-medium">Kcal</span>
                    </div>

                    <div className="space-y-4 text-sm border-t border-black/5 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-black/40 text-xs uppercase tracking-wider font-medium">Protéines</span>
                        <span className="font-bold text-[#303030]">{result.low.p}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#E5E5E5] -mx-3 px-3 py-2 rounded-lg">
                        <span className="text-[#303030] text-xs uppercase tracking-wider font-bold">Glucides</span>
                        <span className="font-bold text-[#303030]">{result.low.c}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/40 text-xs uppercase tracking-wider font-medium">Lipides</span>
                        <span className="font-bold text-[#303030]">{result.low.f}g</span>
                      </div>
                    </div>
                  </div>

                  {/* JOUR HAUT (Style Dark) */}
                  <div className="relative p-8 rounded-[24px] bg-[#1A1A1A] text-white shadow-xl border border-[#DAFA72]/20 group">
                    <div className="absolute top-6 right-6 text-[10px] font-bold text-white/20 uppercase tracking-widest border border-white/10 px-2 py-1 rounded-md">
                      {result.days.high} JOUR
                    </div>
                    <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-8">JOUR HAUT</h3>
                    
                    <div className="mb-8">
                      <span className="text-5xl text-[#DAFA72] font-light tracking-tight">{result.high.kcal}</span>
                      <span className="text-xs text-white/40 ml-2 uppercase font-medium">Kcal</span>
                    </div>

                    <div className="space-y-4 text-sm border-t border-white/10 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Protéines</span>
                        <span className="font-bold text-white">{result.high.p}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#DAFA72] -mx-3 px-3 py-2 rounded-lg">
                        <span className="text-[#303030] text-xs uppercase tracking-wider font-bold">Glucides</span>
                        <span className="font-extrabold text-[#303030]">{result.high.c}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs uppercase tracking-wider font-medium">Lipides</span>
                        <span className="font-bold text-white">{result.high.f}g</span>
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