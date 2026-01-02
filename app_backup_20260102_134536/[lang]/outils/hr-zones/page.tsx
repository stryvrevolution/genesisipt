'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      warnings.push('⚠️ FC repos très basse (&lt;40 bpm): Athlète élite ou erreur de mesure?');
    } else if (rhr > 90) {
      warnings.push('⚠️ FC repos élevée (&gt;90 bpm): Condition physique faible ou problème cardiaque potentiel. Consulter médecin');
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
      warnings.push('ℹ️ Âge &gt;60 ans: Consulter médecin avant training haute intensité (zones 5-6)');
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
    <main className="flex flex-col md:flex-row min-h-screen bg-white font-sans" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* SECTION GAUCHE */}
      <section className="w-full md:w-1/3 bg-[#0E0E0E] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] md:min-h-screen">
        
        <div className="relative z-10">
          <Link href="/outils" className="inline-flex items-center text-white/40 hover:text-white text-xs mb-12 transition-colors uppercase tracking-widest font-bold">
            ← Retour aux outils
          </Link>
          
          <div className="text-[#DAFA72] text-[11px] font-bold tracking-widest uppercase mb-4">
            Physiologie Cardiaque
          </div>
          
          <h1 className="text-white text-5xl md:text-6xl leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-azonix)' }}>
            HR<br />ZONES
          </h1>
          
          <div className="space-y-6">
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm">
              Définissez vos zones d'entraînement cardiaque personnalisées via la méthode Karvonen (FC réserve).
            </p>

            {/* Méthodologie */}
            <div className="space-y-3">
              <h3 className="text-white text-[10px] uppercase tracking-widest font-bold opacity-40">Méthode Karvonen</h3>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Formules</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  <strong>FC Max:</strong> Tanaka (H) 208-(0.7×âge) · Gulati (F) 206-(0.88×âge)
                  <br />
                  <strong>Zone:</strong> (FC_Réserve × %intensité) + FC_Repos
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Mesure FC Repos</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Au réveil, avant de se lever. Moyenne sur 3-5 jours. 30s au poignet × 2 OU cardiofréquencemètre.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#DAFA72] text-[9px] uppercase tracking-widest font-bold mb-2">Progression</div>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Débutants: 80% temps zone 2, 20% zone 3. Avancés: pyramide 70% Z2, 20% Z3, 10% Z4-5.
                </p>
              </div>
            </div>

            {/* Références */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/40 text-[10px] leading-relaxed">
                <span className="font-bold uppercase tracking-wider">Références:</span>
                <br />Tanaka et al. (2001) · Gulati et al. (2010)
                <br />Karvonen Method (1957)
                <br />ACSM Guidelines (2022)
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
            GENESIS LAB — HR ZONES V2.0
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
                Genre (Formule FC Max)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setGender('male'); setResult(null); }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                    gender === 'male'
                    ? 'border-[#303030] bg-[#303030] text-white' 
                    : 'border-black/10 text-black/40 hover:border-black/30'
                  }`}
                >
                  Homme
                </button>
                <button 
                  onClick={() => { setGender('female'); setResult(null); }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium uppercase tracking-wide transition-all border ${
                    gender === 'female'
                    ? 'border-[#303030] bg-[#303030] text-white' 
                    : 'border-black/10 text-black/40 hover:border-black/30'
                  }`}
                >
                  Femme
                </button>
              </div>
            </div>

            {/* INPUTS */}
            <div className="grid grid-cols-2 gap-8">
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  Âge
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
              
              <div className="relative group">
                <label className="block text-[#303030] text-[10px] uppercase tracking-widest mb-2 font-bold opacity-40">
                  FC Repos (bpm)
                  <span className="block text-[9px] text-black/30 font-normal mt-1">Optionnel (matin au réveil)</span>
                </label>
                <input
                  type="number"
                  value={restingHR}
                  onChange={(e) => setRestingHR(e.target.value)}
                  placeholder="60"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-3xl text-[#303030] outline-none focus:border-[#DAFA72] transition-colors font-light placeholder:text-black/5"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={calculateZones}
              disabled={!age}
              className="group w-full relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1A1A1A] text-white text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-[#DAFA72] hover:text-[#1A1A1A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">Calculer mes zones</span>
            </button>

            {/* RÉSULTATS */}
            {result && (
              <div className="mt-16 pt-12 border-t border-black/5 animate-in fade-in duration-700">
                
                {/* Métriques Globales */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 text-center">
                    <div className="text-[9px] text-black/30 uppercase tracking-widest mb-1">FC Max</div>
                    <div className="text-2xl font-bold text-[#303030]">{result.maxHR}</div>
                    <div className="text-[9px] text-black/40">bpm</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 text-center">
                    <div className="text-[9px] text-black/30 uppercase tracking-widest mb-1">FC Repos</div>
                    <div className="text-2xl font-bold text-[#303030]">{result.restingHR}</div>
                    <div className="text-[9px] text-black/40">bpm</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-black/5 text-center">
                    <div className="text-[9px] text-black/30 uppercase tracking-widest mb-1">Réserve FC</div>
                    <div className="text-2xl font-bold text-[#303030]">{result.hrReserve}</div>
                    <div className="text-[9px] text-black/40">bpm</div>
                  </div>
                </div>

                <h3 className="text-[#303030] text-sm font-bold uppercase tracking-widest mb-6">Zones d'Entraînement</h3>

                {/* Zones */}
                <div className="space-y-3 mb-8">
                  {result.zones.map((zone) => (
                    <div key={zone.zone} className={`p-4 rounded-xl border transition-all hover:shadow-md ${zone.color}`}>
                      
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-sm font-bold">
                            {zone.zone}
                          </div>
                          <div>
                            <div className="font-bold text-sm uppercase tracking-wide">{zone.name}</div>
                            <div className="text-[10px] opacity-70">{zone.desc}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg">{zone.bpm}</div>
                          <div className="text-[9px] opacity-60">bpm</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-current/10">
                        <div className="text-[10px] opacity-70">{zone.usage}</div>
                        <div className="text-[10px] font-medium bg-white/40 px-2 py-0.5 rounded">{zone.range}</div>
                      </div>
                      
                    </div>
                  ))}
                </div>

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="text-[11px] text-blue-800 font-medium" dangerouslySetInnerHTML={{ __html: warning }} />
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