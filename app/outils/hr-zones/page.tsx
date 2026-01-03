'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowLeft } from 'lucide-react';

type Gender = 'male' | 'female';

export default function HRZonesPage() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [restingHR, setRestingHR] = useState('');
  
  const [result, setResult] = useState<{
    maxHR: number;
    restingHR: number;
    hrReserve: number;
    zones: Array<{
      zone: number;
      name: string;
      range: string;
      bpm: string;
      desc: string;
      usage: string;
      color: string;
    }>;
    warnings: string[];
  } | null>(null);

  const calculateZones = () => {
    const a = parseFloat(age);
    let rhr = parseFloat(restingHR);

    if (!a) return;

    // ========================================
    // VALIDATION & DEFAULTS
    // ========================================
    
    const warnings: string[] = [];

    // Si FC repos absente, utiliser moyenne estimée
    if (!rhr) {
      rhr = gender === 'male' ? 65 : 70;
      warnings.push('ℹ️ FC repos non renseignée: valeur moyenne utilisée (' + rhr + ' bpm). Mesurez-la au réveil pour plus de précision');
    }

    // Validation FC repos
    if (rhr < 40) {
      warnings.push('⚠️ FC repos très basse (<40 bpm): Athlète élite ou erreur de mesure?');
    } else if (rhr > 90) {
      warnings.push('⚠️ FC repos élevée (>90 bpm): Condition physique faible ou problème cardiaque potentiel. Consulter médecin');
    }

    // ========================================
    // FC MAX (FORMULE SELON GENRE)
    // ========================================
    
    let maxHR: number;
    
    if (gender === 'male') {
      // Tanaka (2001) - Population générale
      maxHR = Math.round(208 - (0.7 * a));
    } else {
      // Gulati (2010) - Femmes spécifique
      maxHR = Math.round(206 - (0.88 * a));
    }

    // ========================================
    // RÉSERVE FC (KARVONEN)
    // ========================================
    
    const hrReserve = maxHR - rhr;

    // ========================================
    // ZONES D'ENTRAÎNEMENT (6 ZONES)
    // ========================================
    
    const zonesConfig = [
      { 
        z: 1, 
        name: "Récupération Active", 
        min: 0.40, 
        max: 0.50, 
        color: "bg-slate-100 text-slate-600 border-slate-200",
        desc: "Marche lente, stretching actif",
        usage: "20-30min post-training intense, récupération"
      },
      { 
        z: 2, 
        name: "Endurance de Base", 
        min: 0.50, 
        max: 0.60, 
        color: "bg-green-50 text-green-700 border-green-200",
        desc: "Zone fat-burning, aérobie légère",
        usage: "60-90min, 3-5×/semaine, fondamental"
      },
      { 
        z: 3, 
        name: "Aérobie", 
        min: 0.60, 
        max: 0.70, 
        color: "bg-blue-50 text-blue-700 border-blue-200",
        desc: "Endurance cardiovasculaire, amélioration VO2",
        usage: "45-60min, 2-3×/semaine"
      },
      { 
        z: 4, 
        name: "Seuil Lactique", 
        min: 0.70, 
        max: 0.80, 
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        desc: "Tempo runs, seuil anaérobie",
        usage: "20-40min, 1-2×/semaine, difficile"
      },
      { 
        z: 5, 
        name: "VO2 Max", 
        min: 0.80, 
        max: 0.90, 
        color: "bg-orange-50 text-orange-700 border-orange-200",
        desc: "Intervalles haute intensité (HIIT)",
        usage: "3-8min × 3-5 reps, 1×/semaine max"
      },
      { 
        z: 6, 
        name: "Anaérobie", 
        min: 0.90, 
        max: 1.00, 
        color: "bg-red-50 text-red-700 border-red-200",
        desc: "Sprints courts, puissance maximale",
        usage: "10-30s × 6-10 reps, 1×/semaine athlètes"
      },
    ];

    const calculatedZones = zonesConfig.map(zone => {
      const minBPM = Math.round((hrReserve * zone.min) + rhr);
      const maxBPM = Math.round((hrReserve * zone.max) + rhr);
      
      return {
        zone: zone.z,
        name: zone.name,
        range: `${Math.round(zone.min * 100)}-${Math.round(zone.max * 100)}%`,
        bpm: `${minBPM}-${maxBPM}`,
        desc: zone.desc,
        usage: zone.usage,
        color: zone.color
      };
    });

    // ========================================
    // WARNINGS SUPPLÉMENTAIRES
    // ========================================
    
    // Warning âge >60 ans
    if (a > 60) {
      warnings.push('ℹ️ Âge >60 ans: Consulter médecin avant training haute intensité (zones 5-6)');
    }

    // Warning FC max calculée vs test terrain
    warnings.push('💡 FC Max calculée (' + maxHR + ' bpm). Pour plus de précision, réalisez un test terrain maximal');

    setResult({
      maxHR,
      restingHR: Math.round(rhr),
      hrReserve,
      zones: calculatedZones,
      warnings
    });
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-outfit text-[#303030]">
      
      {/* SECTION GAUCHE : DESIGN CARTE HUB "ÉTENDUE" */}
      <section className="w-full md:w-5/12 lg:w-1/3 bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen border-r border-white/5 shadow-[20px_0_40px_-10px_rgba(0,0,0,0.2)] z-20">
        
        {/* Filigrane d'arrière-plan */}
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
           <HeartPulse className="w-80 h-80 stroke-[0.5]" />
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
                {/* ICONE CARRÉE GRADIENT (Rose pour Cardio) */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)] flex items-center justify-center text-white">
                   <HeartPulse className="w-7 h-7 stroke-[1.5]" />
                </div>
                
                {/* BADGE TYPE */}
                <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">
                   Cardiovasculaire
                </span>
            </div>
            
            <div className="font-mono text-[10px] text-white/10 font-bold">
              ID: 04
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
            HR Zones
          </h1>
          
          <div className="space-y-8">
            <p className="text-white/50 text-[13px] leading-relaxed font-light border-t border-white/5 pt-6">
              Définissez vos zones d'entraînement cardiaque personnalisées via la méthode Karvonen (FC réserve).
            </p>

            {/* Info Box */}
            <div className="bg-[#0E0E0E] border border-white/5 rounded-xl p-5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[#DAFA72] text-[10px] uppercase tracking-widest font-bold">Méthode Karvonen</span>
                    <span className="text-white/60 font-mono text-[10px]">Précision</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mb-3"></div>
                 <p className="text-white/40 text-[11px] leading-relaxed">
                   Prend en compte votre fréquence cardiaque au repos pour des zones plus adaptées à votre niveau réel.
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
              
              {/* GENRE */}
              <div>
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-4 font-bold opacity-40">
                  Genre (Formule FC Max)
                </label>
                <div className="grid grid-cols-2 gap-4 border-b border-black/5 pb-8">
                  <button 
                    onClick={() => { setGender('male'); setResult(null); }}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                      gender === 'male' 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                      : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                    }`}
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] font-bold">Homme</span>
                  </button>
                  <button 
                    onClick={() => { setGender('female'); setResult(null); }}
                    className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                      gender === 'female' 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                      : 'bg-white text-black/40 border-black/10 hover:border-black/30 hover:text-black/60'
                    }`}
                  >
                    <span className="text-[12px] uppercase tracking-[0.2em] font-bold">Femme</span>
                  </button>
                </div>
              </div>

              {/* Age & Resting HR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="relative group">
                   <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">Âge</label>
                   <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" />
                </div>
                
                <div className="relative group">
                   <label className="block text-[#303030] text-[10px] uppercase tracking-[0.2em] mb-3 font-bold opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#303030] transition-all">
                     FC Repos (bpm)
                     <span className="ml-2 text-[8px] opacity-50 normal-case tracking-normal">Optionnel</span>
                   </label>
                   <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} placeholder="ex: 60" className="w-full bg-transparent border-b border-black/10 py-2 text-2xl text-[#303030] font-light outline-none focus:border-[#303030] transition-all placeholder:text-black/5" />
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={calculateZones} 
                disabled={!age} 
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
                <div className="relative overflow-hidden rounded-[32px] bg-[#1A1A1A] p-10 text-center shadow-2xl mb-12 group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
                  
                  <h3 className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-[#DAFA72] mb-6">
                    Fréquence Cardiaque Max
                  </h3>
                  
                  <div className="relative flex items-baseline justify-center gap-2 mb-8">
                    <span className="text-8xl md:text-9xl font-light tracking-tighter text-white">
                      {result.maxHR}
                    </span>
                    <span className="text-2xl font-medium text-white/30 uppercase tracking-widest">
                      bpm
                    </span>
                  </div>

                  {/* Sub Stats */}
                  <div className="relative grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">FC Repos</div>
                        <div className="text-xl text-white font-light">{result.restingHR} <span className="text-xs text-white/30">bpm</span></div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">FC Réserve</div>
                        <div className="text-xl text-white font-light">{result.hrReserve} <span className="text-xs text-white/30">bpm</span></div>
                    </div>
                  </div>
                </div>

                {/* Zones List */}
                <div className="space-y-6">
                  <h3 className="text-[#303030] text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 pl-2">
                    Zones d'entraînement
                  </h3>
                  
                  <div className="grid gap-3">
                    {result.zones.map((zone) => (
                      <div 
                        key={zone.zone} 
                        className={`group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${zone.color}`}
                      >
                        <div className="flex items-start md:items-center gap-5 mb-4 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                            {zone.zone}
                          </div>
                          <div>
                            <div className="font-bold text-[13px] uppercase tracking-wide leading-tight mb-1">
                              {zone.name}
                            </div>
                            <div className="text-[11px] opacity-70 font-medium leading-tight max-w-xs">
                              {zone.desc}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto pl-14 md:pl-0">
                          <div className="text-[10px] opacity-60 font-mono hidden md:block mb-1">
                             {zone.range}
                          </div>
                          <div className="text-xl font-bold tracking-tight">
                            {zone.bpm} <span className="text-[10px] opacity-50 uppercase">bpm</span>
                          </div>
                          <div className="text-[10px] opacity-60 font-medium md:hidden bg-white/40 px-2 py-0.5 rounded">
                             {zone.range}
                          </div>
                        </div>
                      </div>
                    ))}
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