'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Dumbbell, ArrowLeft, ChevronDown } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// --- TYPES ---
type Formula = 'brzycki' | 'epley' | 'lombardi' | 'average';
type Unit = 'kg' | 'lbs';

export default function RMCalculatorPage() {
  // --- STATES ---
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [formula, setFormula] = useState<Formula>('average');
  const [unit, setUnit] = useState<Unit>('kg');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<{
    oneRM: number;
    brzycki: number;
    epley: number;
    lombardi: number;
    warnings: string[];
  } | null>(null);

  // --- FORMULES 1RM ---
  const calculateBrzycki = (w: number, r: number): number => w / (1.0278 - 0.0278 * r);
  const calculateEpley = (w: number, r: number): number => w * (1 + 0.0333 * r);
  const calculateLombardi = (w: number, r: number): number => w * Math.pow(r, 0.1);

  // --- LOGIQUE CALCUL ---
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
    if (r === 1) warnings.push('1 répétition = votre 1RM actuel (pas d\'estimation nécessaire).');
    if (r > 10) warnings.push('Précision réduite au-delà de 10 reps (±10-15% selon études NSCA 2016).');
    if (r > 15) warnings.push('Estimation très imprécise (>15 reps). Test terrain maximal recommandé.');
    if (r >= 2 && r <= 8) warnings.push('✓ Zone optimale de précision (±2.5% selon Brzycki, 1993).');

    setResult({ oneRM: selectedRM, brzycki, epley, lombardi, warnings });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const displayWeight = (w: number): string => {
    const converted = unit === 'lbs' ? w * 2.20462 : w;
    return unit === 'kg' ? `${Math.round(converted * 2) / 2}` : `${Math.round(converted)}`;
  };

  // --- ZONES D'ENTRAÎNEMENT SCIENTIFIQUES ---
  const trainingZones = result ? [
    { num: 1, intensity: "95-100%", weight: result.oneRM, reps: "1 rep", objective: "Force Maximale", desc: "Test 1RM / Compétition (Adaptation neurale)", color: "from-red-50 to-red-100/50", border: "border-red-200/50" },
    { num: 2, intensity: "85-90%", weight: result.oneRM * 0.875, reps: "3-5 reps", objective: "Force Pure", desc: "Recrutement UM rapides (Zatsiorsky, 2006)", color: "from-orange-50 to-orange-100/50", border: "border-orange-200/50" },
    { num: 3, intensity: "80-85%", weight: result.oneRM * 0.825, reps: "5-8 reps", objective: "Force-Hypertrophie", desc: "Transition volume/intensité", color: "from-yellow-50 to-yellow-100/50", border: "border-yellow-200/50" },
    { num: 4, intensity: "70-80%", weight: result.oneRM * 0.75, reps: "8-12 reps", objective: "Hypertrophie", desc: "Synthèse protéique optimale (Schoenfeld, 2010)", color: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50" },
    { num: 5, intensity: "60-70%", weight: result.oneRM * 0.65, reps: "12-15+ reps", objective: "Endurance Musculaire", desc: "Capacité oxydative mitochondriale", color: "from-blue-50 to-blue-100/50", border: "border-blue-200/50" },
    { num: 6, intensity: "<60%", weight: result.oneRM * 0.50, reps: "20+ reps", objective: "Technique / Échauffement", desc: "Apprentissage moteur (Schmidt, 1975)", color: "from-slate-50 to-slate-100/50", border: "border-slate-200/50" },
  ] : [];

  const faqItems = [
    { 
      question: "Qu'est-ce que le 1RM et pourquoi est-ce important ?", 
      answer: "Le 1RM (One Repetition Maximum) est la charge maximale que vous pouvez soulever pour une seule répétition avec une technique correcte. C'est le standard universel en sciences du sport pour quantifier la force absolue. Établi par les travaux de DeLorme (1945) et validé par la NSCA, le 1RM permet de programmer précisément l'intensité d'entraînement (% du max) pour atteindre des adaptations spécifiques : force pure (>85%), hypertrophie (70-85%), ou endurance musculaire (<70%). Sans connaissance du 1RM, impossible de périodiser correctement votre entraînement." 
    },
    { 
      question: "Pourquoi trois formules différentes (Brzycki, Epley, Lombardi) ?", 
      answer: "Chaque formule a été développée sur des populations spécifiques avec des biais mathématiques différents. Brzycki (1993) est linéaire et conservateur, validé sur 394 athlètes avec ±2.5% de précision pour 2-10 reps. Epley (1985) utilise une progression arithmétique simple, fiable pour charges lourdes. Lombardi (1989) applique une fonction logarithmique, optimale pour powerlifters. La formule 'Moyenne' compense leurs biais individuels en agrégeant les trois résultats, offrant la meilleure fiabilité globale selon méta-analyse NSCA (2016). Pour 3-8 reps, toutes convergent (écart <3%)." 
    },
    { 
      question: "Comment utiliser les zones d'entraînement calculées ?", 
      answer: "Les 6 zones d'intensité (exprimées en % du 1RM) correspondent aux adaptations physiologiques établies par Zatsiorsky & Kraemer (2006). Zone 1 (95-100%) = test maximal uniquement. Zone 2 (85-90%) = adaptations neurales, recrutement d'unités motrices rapides, 3-5 reps. Zone 3 (80-85%) = transition force/volume, 5-8 reps. Zone 4 (70-80%) = hypertrophie myofibrillaire optimale, 8-12 reps (Schoenfeld, 2010). Zone 5 (60-70%) = endurance musculaire, capacité de travail. Zone 6 (<60%) = technique, échauffement, apprentissage moteur. Alternez les zones selon votre cycle de périodisation (bloc force → hypertrophie → pic)." 
    },
    {
      question: "Le calculateur est-il fiable pour tous les exercices ?",
      answer: "Les formules 1RM sont validées principalement sur mouvements polyarticulaires lourds (Squat, Bench Press, Deadlift) où la relation charge-répétitions est stable. Pour exercices d'isolation (curls, extensions) ou mouvements balistiques (Olympic lifts), la précision diminue car la fatigue métabolique prédomine sur la force pure. Pour maximiser la fiabilité : (1) Utilisez 3-8 reps, (2) Technique parfaite, (3) Repos complet (3-5min), (4) Exercices composés de préférence. Si vous êtes débutant (<6 mois entraînement), privilégiez un test terrain maximal supervisé."
    },
    {
      question: "Quelle différence entre 1RM calculé et 1RM testé ?",
      answer: "Le 1RM calculé est une estimation mathématique basée sur performance sous-maximale (ex: 80kg × 6 reps). Le 1RM testé est votre charge maximale réelle levée en condition de test. Avantages calcul : pas de fatigue extrême, pas de risque blessure, répétable fréquemment. Limites : ±2.5% précision optimale (3-8 reps), biais individuel (efficacité neuromusculaire variable). Le test terrain reste le gold standard mais nécessite expérience technique, échauffement progressif (12-15 séries), et récupération (48-72h). Utilisez le calculateur pour programmer vos cycles, testez votre 1RM réel tous les 8-12 semaines en pic de forme."
    }
  ];

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
        
        {/* ================= GAUCHE (Design Carb Cycling) ================= */}
        <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
          
          {/* Filigrane */}
          <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
             <Dumbbell className="w-80 h-80 stroke-[0.5]" />
          </div>

          <div className="relative z-10">
            <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
            </Link>
            
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_20px_-5px_rgba(250,204,21,0.4)] flex items-center justify-center text-white">
                     <Dumbbell className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Charges</span>
              </div>
            </div>
            
            <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
              1RM Calculator
            </h1>
            
            {/* DESCRIPTION SCIENTIFIQUE ENRICHIE */}
            <div className="space-y-6 border-t border-white/5 pt-6">
              <div>
                <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">Le Standard de Référence</h2>
                <p className="text-white/50 text-[13px] leading-relaxed font-light">
                  Le 1RM (One Repetition Maximum) est la mesure universelle de la force absolue en sciences du sport. Notre calculateur utilise les trois formules validées scientifiquement.
                </p>
              </div>

              <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
                <p>Cet outil combine trois algorithmes éprouvés :</p>
                
                <div className="space-y-2 pl-4 border-l-2 border-yellow-500/30">
                  <p><strong className="text-white/70">• Brzycki (1993)</strong> : Gold standard pour 2-10 répétitions. Validation sur 394 athlètes (±2.5% précision).</p>
                  <p><strong className="text-white/70">• Epley (1985)</strong> : Formule linéaire conservatrice. Fiable pour charges lourdes (3-6 reps).</p>
                  <p><strong className="text-white/70">• Lombardi (1989)</strong> : Approche logarithmique. Optimale pour powerlifters expérimentés.</p>
                </div>

                <p className="pt-2">
                  La <strong className="text-white/90">formule Moyenne</strong> (recommandée) agrège les trois pour compenser leurs biais individuels et maximiser la fiabilité.
                </p>

                <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                  Références : Brzycki (1993) NSCA • Epley (1985) Boyd Epley • Lombardi (1989) ACSM
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Forensic Labs</p>
            <span className="font-azonix text-xs opacity-30">V3.0</span>
          </div>
        </section>

        {/* ================= DROITE : Design #303030 (comme Carb Cycling) ================= */}
        <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
            <div className="max-w-3xl mx-auto space-y-12">
                
                {/* HEADER */}
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Calcul 1RM</h3>
                    <p className="text-sm text-white/40 font-medium">Estimation charge maximale</p>
                </div>

                {/* INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    
                    {/* Charge */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Charge levée ({unit})</label>
                        <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        placeholder="80"
                        className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                        />
                    </div>

                    {/* Répétitions */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Répétitions effectuées</label>
                        <input 
                        type="number" 
                        value={reps} 
                        onChange={(e) => setReps(e.target.value)} 
                        placeholder="6"
                        className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                        />
                    </div>
                </div>

                {/* UNITÉ */}
                <div className="pt-8 border-t border-white/5">
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Unité de mesure</label>
                        <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                            {(['kg', 'lbs'] as Unit[]).map(u => (
                                <button 
                                key={u} 
                                onClick={() => setUnit(u)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${unit === u ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    {u.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FORMULE */}
                <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Algorithme de calcul</h3>
                            <p className="text-sm text-white/40">Formule 1RM</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer détails' : 'Détails formules'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { id: 'average', label: 'Moyenne' },
                            { id: 'brzycki', label: 'Brzycki' },
                            { id: 'epley', label: 'Epley' },
                            { id: 'lombardi', label: 'Lombardi' }
                        ].map(f => (
                            <button 
                            key={f.id}
                            onClick={() => setFormula(f.id as Formula)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-24 ${formula === f.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                            >
                                <span className="text-sm font-bold">{f.label}</span>
                            </button>
                        ))}
                    </div>

                    {showAdvanced && (
                        <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                            <div className="text-xs text-white/60 space-y-2">
                                <p><strong className="text-white/80">Brzycki (1993):</strong> 1RM = Poids / (1.0278 - 0.0278 × Reps)</p>
                                <p><strong className="text-white/80">Epley (1985):</strong> 1RM = Poids × (1 + 0.0333 × Reps)</p>
                                <p><strong className="text-white/80">Lombardi (1989):</strong> 1RM = Poids × Reps^0.1</p>
                                <p className="pt-2 border-t border-white/5"><strong className="text-white/80">Moyenne:</strong> (Brzycki + Epley + Lombardi) / 3</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button 
                    onClick={calculateRM}
                    disabled={!weight || !reps}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Calculer le 1RM
                </button>

            </div>

            {/* RÉSULTATS */}
            <div ref={resultsRef}>
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
                    
                    {/* WARNINGS */}
                    {result.warnings.length > 0 && (
                        <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                            {result.warnings.map((w, i) => (
                                <div key={i} className="text-sm text-white/90 font-medium">• {w}</div>
                            ))}
                        </div>
                    )}

                    {/* 1RM PRINCIPALE */}
                    <div className="bg-[#252525] p-6 rounded-xl border border-white/5 text-center">
                        <div className="text-[11px] font-medium text-white/40 mb-2">1RM Calculé</div>
                        <div className="text-5xl md:text-6xl font-bold text-white">{displayWeight(result.oneRM)} <span className="text-2xl text-white/40">{unit}</span></div>
                        <div className="text-[10px] font-medium mt-3 text-white/50 bg-black/20 inline-block px-3 py-1 rounded-full">
                            Formule: {formula === 'average' ? 'Moyenne' : formula.charAt(0).toUpperCase() + formula.slice(1)}
                        </div>
                    </div>

                    {/* COMPARAISON FORMULES */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Brzycki</div>
                            <div className="text-xl font-bold text-white">{displayWeight(result.brzycki)}</div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Epley</div>
                            <div className="text-xl font-bold text-white">{displayWeight(result.epley)}</div>
                        </div>
                        <div className="bg-[#252525] p-4 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 mb-1">Lombardi</div>
                            <div className="text-xl font-bold text-white">{displayWeight(result.lombardi)}</div>
                        </div>
                    </div>

                    {/* ZONES D'ENTRAÎNEMENT */}
                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-white mb-6">Zones d'entraînement</h3>
                        
                        <div className="space-y-3">
                            {trainingZones.map((zone) => (
                                <div 
                                key={zone.num}
                                className={`bg-gradient-to-br ${zone.color} border ${zone.border} p-6 rounded-2xl`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">
                                                {zone.num}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">{zone.objective}</div>
                                                <div className="text-[10px] text-[#1A1A1A]/60">{zone.desc}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-2xl text-[#1A1A1A]">{displayWeight(zone.weight)}{unit}</div>
                                            <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{zone.intensity}</div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-[#1A1A1A]/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#1A1A1A]/60 font-medium">Répétitions</span>
                                            <span className="text-[10px] font-bold text-[#1A1A1A] bg-white px-2 py-1 rounded-md shadow-sm">{zone.reps}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NOTE SCIENTIFIQUE */}
                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            <strong className="text-white/90">Méthodologie :</strong> 1RM calculé selon formule {formula === 'average' ? 'Moyenne (Brzycki+Epley+Lombardi)/3' : formula.charAt(0).toUpperCase() + formula.slice(1)}. Précision optimale : 3-8 reps (±2.5%). Pour validation, effectuez un test terrain maximal tous les 8-12 semaines avec échauffement progressif et technique irréprochable.
                        </p>
                    </div>
                </div>
            )}
            </div>

            {/* FAQ */}
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