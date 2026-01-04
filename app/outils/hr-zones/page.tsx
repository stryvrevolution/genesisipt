'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowLeft, ChevronDown } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// --- TYPES ---
type Gender = 'male' | 'female';

export default function HRZonesPage() {
  // --- STATES ---
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [restingHR, setRestingHR] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
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
      border: string;
    }>;
    warnings: string[];
  } | null>(null);

  // --- LOGIQUE CALCUL ---
  const calculateZones = () => {
    const a = parseFloat(age);
    let rhr = parseFloat(restingHR);

    if (!a) return;

    const warnings: string[] = [];

    // Valeur par défaut FC repos
    if (!rhr) {
      rhr = gender === 'male' ? 65 : 70;
      warnings.push('FC repos non renseignée : valeur moyenne utilisée (' + rhr + ' bpm). Pour précision optimale, mesurez votre FC au réveil pendant 3 jours consécutifs et faites la moyenne.');
    }

    // Validation FC repos
    if (rhr < 40) {
      warnings.push('FC repos très basse (<40 bpm) : Caractéristique athlètes d\'endurance élite (cyclistes, marathoniens) ou erreur de mesure. Vérifier.');
    } else if (rhr > 90) {
      warnings.push('FC repos élevée (>90 bpm) : Indicateur potentiel de déconditionnement cardiovasculaire ou stress chronique. Consultation médicale recommandée.');
    } else if (rhr >= 40 && rhr <= 60) {
      warnings.push('✓ FC repos excellente (40-60 bpm) : Indicateur de bonne condition cardiovasculaire (validation Karvonen, 1957).');
    }

    // FC MAX selon genre
    let maxHR: number;
    if (gender === 'male') {
      maxHR = Math.round(208 - (0.7 * a)); // Tanaka 2001
    } else {
      maxHR = Math.round(206 - (0.88 * a)); // Gulati 2010
    }

    // Réserve FC (Karvonen)
    const hrReserve = maxHR - rhr;

    // ZONES D'ENTRAÎNEMENT SCIENTIFIQUES
    const zonesConfig = [
      { 
        z: 1, 
        name: "Récupération Active", 
        min: 0.40, 
        max: 0.50, 
        color: "from-slate-50 to-slate-100/50",
        border: "border-slate-200/50",
        desc: "Flux sanguin sans stress métabolique",
        usage: "20-30min post-training, accélère récupération"
      },
      { 
        z: 2, 
        name: "Endurance de Base", 
        min: 0.50, 
        max: 0.60, 
        color: "from-green-50 to-green-100/50",
        border: "border-green-200/50",
        desc: "Oxydation lipides max, développement mitochondrial (Seiler, 2010)",
        usage: "60-90min, 3-5×/sem, fondation aérobie"
      },
      { 
        z: 3, 
        name: "Aérobie", 
        min: 0.60, 
        max: 0.70, 
        color: "from-blue-50 to-blue-100/50",
        border: "border-blue-200/50",
        desc: "Amélioration VO2 sous-maximal, économie geste",
        usage: "45-60min, 2-3×/sem, tempo modéré"
      },
      { 
        z: 4, 
        name: "Seuil Lactique", 
        min: 0.70, 
        max: 0.80, 
        color: "from-yellow-50 to-yellow-100/50",
        border: "border-yellow-200/50",
        desc: "Équilibre production/clearance lactate (Billat, 2001)",
        usage: "20-40min, 1-2×/sem, clé performance"
      },
      { 
        z: 5, 
        name: "VO2 Max", 
        min: 0.80, 
        max: 0.90, 
        color: "from-orange-50 to-orange-100/50",
        border: "border-orange-200/50",
        desc: "Puissance aérobie maximale, HIIT (Tabata, 1996)",
        usage: "3-8min × 3-5 reps, 1×/sem max, récup complète"
      },
      { 
        z: 6, 
        name: "Anaérobie", 
        min: 0.90, 
        max: 1.00, 
        color: "from-red-50 to-red-100/50",
        border: "border-red-200/50",
        desc: "ATP non-oxydatif, recrutement fibres IIx rapides",
        usage: "10-30s × 6-10 reps, athlètes confirmés uniquement"
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
        color: zone.color,
        border: zone.border
      };
    });

    // Warnings supplémentaires
    if (a > 60) {
      warnings.push('Âge >60 ans : Clearance médicale obligatoire avant HIIT (zones 5-6) selon guidelines ACSM 2018. Risque cardiovasculaire accru.');
    }

    if (a < 20) {
      warnings.push('Âge <20 ans : Formules FC Max optimisées pour adultes (20-80 ans). Précision réduite pour adolescents.');
    }

    warnings.push('FC Max calculée (' + maxHR + ' bpm) selon formule ' + (gender === 'male' ? 'Tanaka 2001' : 'Gulati 2010') + '. Pour validation individuelle, réalisez un test progressif maximal supervisé (Bruce Protocol ou Rampe).');

    setResult({
      maxHR,
      restingHR: Math.round(rhr),
      hrReserve,
      zones: calculatedZones,
      warnings
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const faqItems = [
    { 
      question: "Qu'est-ce que la méthode Karvonen et pourquoi est-elle supérieure ?", 
      answer: "La méthode Karvonen (1957, Annals of Medicine) utilise la fréquence cardiaque de réserve (FCR = FC Max - FC Repos) plutôt que simplement un pourcentage de FC Max. Cette approche intègre votre condition cardiovasculaire individuelle : une FC repos basse (athlète entraîné) vs élevée (débutant) donnera des zones différentes à même FC Max. Validation scientifique : corrélation 0.92 avec seuils lactiques mesurés en laboratoire (Swain & Leutholtz, 1997). Les formules simplistes (ex: 220-âge × 70%) ignorent ce paramètre crucial et peuvent sous-estimer l'intensité réelle chez personnes entraînées ou surestimer chez débutants, augmentant risque de surmenage." 
    },
    { 
      question: "Pourquoi des formules différentes homme/femme pour FC Max ?", 
      answer: "Les études historiques (Astrand, Fox) utilisaient principalement des hommes. Gulati et al. (2010, Circulation) ont démontré sur 5,437 femmes que la formule classique 220-âge surestime systématiquement la FC Max féminine de 5-13 bpm. La formule spécifique femme (206 - 0.88×âge) corrige ce biais avec précision ±10 bpm (vs ±15 bpm formule générique). Différences physiologiques : taille cardiaque relative, volume sanguin, influence hormonale sur automatisme sinusal. Tanaka (2001, JACC) a affiné pour hommes (208 - 0.7×âge) sur méta-analyse 18,712 sujets, remplaçant l'obsolète 220-âge (origine inconnue, jamais validée scientifiquement)." 
    },
    { 
      question: "Comment mesurer correctement ma FC repos et pourquoi est-ce crucial ?", 
      answer: "Protocole validé ACSM : Au réveil, allongé, avant lever, après 5min repos complet. Palpation carotide ou radiale pendant 60 secondes exactes (pas 15s×4, trop imprécis). Répéter 3-5 matins consécutifs, éliminer valeurs aberrantes, calculer moyenne. FC repos reflète état système nerveux autonome et capacité cardiovasculaire : <50 bpm = excellent (athlètes endurance), 50-60 = très bon, 60-70 = bon, 70-80 = moyen, >80 = amélioration nécessaire. Variation ≥5 bpm jour/jour = indicateur fatigue, surentraînement, stress, maladie débutante (Plews et al., 2013). FC repos intégrée dans calcul Karvonen modifie zones de 10-20 bpm selon condition physique, impactant directement efficacité entraînement et prévention surmenage." 
    },
    {
      question: "Les 6 zones d'entraînement correspondent-elles à des adaptations physiologiques réelles ?",
      answer: "Oui, validées par ACSM Position Stand (2011) et physiologie exercice. Zone 1 (40-50% FCR) : Récupération active, flux sanguin sans stress métabolique. Zone 2 (50-60%) : Oxydation lipides maximale, développement mitochondrial, capillarisation (Seiler, 2010). Zone 3 (60-70%) : Amélioration VO2max sous-maximale, économie course. Zone 4 (70-80%) : Seuil lactique/anaérobie, équilibre production/clearance lactate, clé performance endurance (Billat, 2001). Zone 5 (80-90%) : VO2max, puissance aérobie maximale, stimulus intense limité (3-8min). Zone 6 (90-100%) : Anaérobie lactique, production ATP non-oxydatif, sprints courts uniquement. Chaque zone recrute fibres musculaires spécifiques (Type I lentes vs Type IIa/IIx rapides) et induit adaptations enzymatiques distinctes. Périodisation intelligente alterne zones selon objectifs (endurance = 80% zone 2, performance = pyramide zones)."
    },
    {
      question: "Quelle différence entre FC Max calculée et FC Max testée, et comment la tester ?",
      answer: "FC Max calculée (formules Tanaka/Gulati) est estimation population avec marge ±10 bpm (écart-type). FC Max testée = valeur individuelle réelle, gold standard. Test recommandé : Bruce Protocol (tapis roulant incrémental) ou Test Rampe (vélo) supervisé médical si >40 ans ou facteurs risque. Alternative terrain : échauffement 15min, puis 3×3min intensité croissante (récup 2min), sprint final 2-3min all-out, FC peak = FC Max réelle. Précaution : exige condition physique correcte, technique irréprochable, risque cardiovasculaire élevé si pathologie méconnue. Différence calcul/test peut atteindre ±15 bpm chez 10% population (variabilité génétique, entraînement). Pour programmation précise (compétiteurs), tester tous 6-12 mois. Pour population générale, formules suffisent (précision acceptable usage santé/fitness)."
    }
  ];

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
        
        {/* ================= GAUCHE ================= */}
        <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
          
          <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
             <HeartPulse className="w-80 h-80 stroke-[0.5]" />
          </div>

          <div className="relative z-10">
            <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
            </Link>
            
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)] flex items-center justify-center text-white">
                     <HeartPulse className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Cardiovasculaire</span>
              </div>
            </div>
            
            <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
              HR Zones
            </h1>
            
            {/* DESCRIPTION SCIENTIFIQUE ENRICHIE */}
            <div className="space-y-6 border-t border-white/5 pt-6">
              <div>
                <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">La Méthode de Référence</h2>
                <p className="text-white/50 text-[13px] leading-relaxed font-light">
                  La méthode Karvonen (1957) reste le gold standard pour calculer les zones d'entraînement cardiaque. Contrairement aux formules simplistes (% FC Max), elle intègre votre FC repos, reflétant ainsi votre condition cardiovasculaire réelle.
                </p>
              </div>

              <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
                <p>Notre calculateur utilise les formules validées les plus récentes :</p>
                
                <div className="space-y-2 pl-4 border-l-2 border-rose-500/30">
                  <p><strong className="text-white/70">• Tanaka et al. (2001)</strong> : FC Max homme = 208 - (0.7 × âge). Validation sur 18,712 sujets. Précision ±10 bpm.</p>
                  <p><strong className="text-white/70">• Gulati et al. (2010)</strong> : FC Max femme = 206 - (0.88 × âge). Étude spécifique 5,437 femmes (St. James Women Take Heart Project).</p>
                  <p><strong className="text-white/70">• Karvonen (1957)</strong> : Zone Target = ((FC Max - FC Repos) × %Intensité) + FC Repos. Méthode de la réserve cardiaque.</p>
                </div>

                <p className="pt-2">
                  Les <strong className="text-white/90">6 zones physiologiques</strong> correspondent aux seuils métaboliques établis par l'American College of Sports Medicine (ACSM) et validés par des décennies de recherche en physiologie de l'exercice.
                </p>

                <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                  Références : Karvonen (1957) Annals of Medicine • Tanaka (2001) JACC • Gulati (2010) Circulation
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Stryv Lab</p>
            <span className="font-azonix text-xs opacity-30">V3.0</span>
          </div>
        </section>

        {/* ================= DROITE ================= */}
        <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
            <div className="max-w-3xl mx-auto space-y-12">
                
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Calcul zones cardiaques</h3>
                    <p className="text-sm text-white/40 font-medium">Méthode Karvonen (FC réserve)</p>
                </div>

                <div className="space-y-8">
                    
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Genre (formule FC Max)</label>
                        <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                            {(['male', 'female'] as Gender[]).map(g => (
                                <button 
                                key={g} 
                                onClick={() => setGender(g)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === g ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    {g === 'male' ? 'Homme' : 'Femme'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Âge (années)</label>
                            <input 
                            type="number" 
                            value={age} 
                            onChange={(e) => setAge(e.target.value)} 
                            placeholder="30"
                            className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">FC Repos <span className="text-[11px] text-white/30">(optionnel)</span></label>
                            <input 
                            type="number" 
                            value={restingHR} 
                            onChange={(e) => setRestingHR(e.target.value)} 
                            placeholder="65"
                            className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Formules utilisées</h3>
                            <p className="text-sm text-white/40">FC Max selon genre</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer détails' : 'Voir formules'}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                            <div className="text-xs text-white/60 space-y-2">
                                <p><strong className="text-white/80">Homme (Tanaka, 2001):</strong> FC Max = 208 - (0.7 × Âge)</p>
                                <p><strong className="text-white/80">Femme (Gulati, 2010):</strong> FC Max = 206 - (0.88 × Âge)</p>
                                <p className="pt-2 border-t border-white/5"><strong className="text-white/80">Karvonen (1957):</strong> Zone% = ((FC Max - FC Repos) × Intensité%) + FC Repos</p>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={calculateZones}
                    disabled={!age}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Calculer les zones
                </button>

            </div>

            <div ref={resultsRef}>
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
                    
                    {result.warnings.length > 0 && (
                        <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                            {result.warnings.map((w, i) => (
                                <div key={i} className="text-sm text-white/90 font-medium">• {w}</div>
                            ))}
                        </div>
                    )}

                    <div className="bg-[#252525] p-6 rounded-xl border border-white/5 text-center">
                        <div className="text-[11px] font-medium text-white/40 mb-2">Fréquence Cardiaque Maximale</div>
                        <div className="text-5xl md:text-6xl font-bold text-white">{result.maxHR} <span className="text-2xl text-white/40">bpm</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">FC Repos</div>
                            <div className="text-xl font-bold text-white">{result.restingHR} <span className="text-sm text-white/40">bpm</span></div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">FC Réserve</div>
                            <div className="text-xl font-bold text-white">{result.hrReserve} <span className="text-sm text-white/40">bpm</span></div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-white mb-6">Zones d'entraînement (6 zones)</h3>
                        
                        <div className="space-y-3">
                            {result.zones.map((zone) => (
                                <div 
                                key={zone.zone}
                                className={`bg-gradient-to-br ${zone.color} border ${zone.border} p-6 rounded-2xl`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">
                                                {zone.zone}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">{zone.name}</div>
                                                <div className="text-[10px] text-[#1A1A1A]/60">{zone.desc}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-2xl text-[#1A1A1A]">{zone.bpm} bpm</div>
                                            <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{zone.range}</div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-[#1A1A1A]/10">
                                        <div className="text-[10px] text-[#1A1A1A]/70 font-medium">{zone.usage}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            <strong className="text-white/90">Méthodologie :</strong> FC Max calculée via {gender === 'male' ? 'formule Tanaka (2001) validée sur 18,712 sujets' : 'formule Gulati (2010) spécifique femmes (n=5,437)'}. Zones selon méthode Karvonen (1957) - réserve cardiaque. Corrélation 0.92 avec seuils lactiques laboratoire (Swain & Leutholtz, 1997). Pour validation individuelle : test progressif maximal supervisé (Bruce Protocol).
                        </p>
                    </div>
                </div>
            )}
            </div>

            <div className="mt-24 max-w-3xl mx-auto pb-24">
                <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes</h2>
                <div className="space-y-3">
                    {faqItems.map((item, i) => (
                        <div key={i} className="bg-[#252525] border border-white/5 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} 
                                className="w-full flex justify-between items-center p-5 text-left font-medium text-sm text-white hover:bg-white/5 transition-colors"
                            >
                                <span className="pr-4">{item.question}</span>
                                <ChevronDown className={`flex-shrink-0 w-4 h-4 text-white/40 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaqIndex === i && (
                                <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-4">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </section>
      </main>

      <GenesisAssistant />
    </>
  );
}