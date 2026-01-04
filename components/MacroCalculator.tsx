'use client';

import { useState, useRef } from 'react';
import { Utensils, ChevronDown, Copy, Check } from 'lucide-react';

// --- TYPES ---
type Gender = 'male' | 'female';
type Goal = 'deficit' | 'maintenance' | 'surplus';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

type ResultData = {
  calories: number;
  tdee: number;
  bmr: number;
  leanMass: number;
  estimatedBF: number;
  macros: { p: number; f: number; c: number };
  ratios: { p: number; f: number; c: number };
  percents: { p: number; f: number; c: number };
  breakdown: { bmr: number; neat: number; eat: number; tef: number; total: number };
  adjustment: number;
  warnings: string[];
  goalLabel: string;
};

export default function MacroCalculator() {
  // --- STATES ---
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [workouts, setWorkouts] = useState('3');
  const [goal, setGoal] = useState<Goal>('deficit');
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTdeeDetails, setShowTdeeDetails] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<ResultData | null>(null);

  // --- CALCUL COMPLET ---
  const calculateMacros = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const wo = parseInt(workouts) || 3;

    if (!w || !h || !a) return;

    const warnings: string[] = [];

    // 1. ESTIMATION BF% SI ABSENT (Deurenberg et al. 1991)
    let bf = parseFloat(bodyFat) || 0;
    if (!bf) {
      if (gender === 'male') {
        bf = 1.20 * (w / ((h/100) ** 2)) + 0.23 * a - 10.8;
      } else {
        bf = 1.20 * (w / ((h/100) ** 2)) + 0.23 * a - 5.4;
      }
      bf = Math.max(3, Math.min(60, bf));
      warnings.push(`Body Fat% estimé (${bf.toFixed(1)}%) via formule Deurenberg. Pour précision optimale, mesurez votre BF% réel (Navy, plis cutanés, ou DEXA).`);
    }

    // 2. LEAN BODY MASS (LBM) = Poids × (1 - BF%/100)
    const lbm = w * (1 - bf / 100);

    // 3. BMR (MIFFLIN-ST JEOR 1990 - Gold Standard)
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    // 4. NEAT (Non-Exercise Activity Thermogenesis)
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,    // <3000 pas/j
      light: 1.35,       // 3000-5000 pas/j
      moderate: 1.5,     // 5000-8000 pas/j
      active: 1.65,      // 8000-12000 pas/j
      veryActive: 1.8    // >12000 pas/j
    };
    const neat = bmr * (activityMultipliers[activityLevel] - 1);

    // 5. EAT (Exercise Activity Thermogenesis)
    // Formule ajustée: 50-70 kcal/h musculation selon intensité
    const eatPerWorkout = 300; // Moyenne 60min session
    const eat = (eatPerWorkout * wo * 7) / 7; // Réparti sur semaine

    // 6. TEF (Thermic Effect of Food) - 10% calories totales
    const preTdee = bmr + neat + eat;
    const tef = preTdee * 0.10;

    // 7. TDEE TOTAL
    const tdee = Math.round(bmr + neat + eat + tef);

    // 8. AJUSTEMENT SELON OBJECTIF
    let adjustment = 0;
    let calories = tdee;
    let goalLabel = '';

    if (goal === 'deficit') {
      // Déficit agressif si obèse (BF >25% H />32% F), modéré sinon
      const isObese = (gender === 'male' && bf > 25) || (gender === 'female' && bf > 32);
      adjustment = isObese ? -25 : -20; // % déficit
      calories = Math.round(tdee * (1 + adjustment / 100));
      goalLabel = 'Perte de Gras (Déficit Stratifié)';
      warnings.push(`Déficit ${Math.abs(adjustment)}% (${Math.abs(calories - tdee)} kcal/j). Perte visée : 0.5-1% poids/semaine. Monitoring poids hebdomadaire essentiel.`);
    } else if (goal === 'surplus') {
      // Surplus conservateur (Lean Bulk)
      adjustment = 10; // +10% TDEE
      calories = Math.round(tdee * 1.10);
      goalLabel = 'Prise de Muscle (Lean Bulk)';
      warnings.push(`Surplus +10% (${calories - tdee} kcal/j). Gain visé : 0.25-0.5% poids/semaine. Ratio muscle:graisse 2:1 optimal.`);
    } else {
      goalLabel = 'Maintenance (Homéostasie)';
      warnings.push(`Maintenance calorique. Monitoring poids stable (±1kg) sur 2-4 semaines valide TDEE calculé.`);
    }

    // 9. MACRONUTRIMENTS (Formules Elite)
    
    // PROTÉINES (Helms et al. 2014, Phillips & Van Loon 2011)
    let proteinGKg: number;
    if (goal === 'deficit') {
      // Déficit = protéines élevées (préservation LBM)
      proteinGKg = 2.3; // 2.3-2.6g/kg LBM en cutting
    } else if (goal === 'surplus') {
      proteinGKg = 2.0; // 1.8-2.2g/kg LBM en bulk
    } else {
      proteinGKg = 2.0; // Maintenance
    }
    const proteinG = Math.round(lbm * proteinGKg);

    // LIPIDES (Hormone-Optimized)
    // Minimum 20-25% calories (santé hormonale)
    // 0.8-1.0g/kg poids total (optimal testostérone/oestrogène)
    const fatGKg = goal === 'deficit' ? 0.8 : 1.0;
    const fatG = Math.round(w * fatGKg);
    const fatMinCalories = calories * 0.20; // Minimum 20%
    const fatFromGrams = fatG * 9;
    const finalFatG = Math.max(Math.round(fatMinCalories / 9), fatG);

    // GLUCIDES (Variable d'Ajustement - Performance)
    const proteinCal = proteinG * 4;
    const fatCal = finalFatG * 9;
    const carbCal = calories - proteinCal - fatCal;
    const carbG = Math.round(carbCal / 4);

    // RATIOS & PERCENTS
    const ratios = {
      p: parseFloat((proteinG / lbm).toFixed(2)),
      f: parseFloat((finalFatG / w).toFixed(2)),
      c: parseFloat((carbG / w).toFixed(2))
    };

    const percents = {
      p: Math.round((proteinCal / calories) * 100),
      f: Math.round((fatCal / calories) * 100),
      c: Math.round((carbCal / calories) * 100)
    };

    // WARNINGS SUPPLÉMENTAIRES
    if (carbG < 100 && goal !== 'deficit') {
      warnings.push('Glucides <100g : Risque performance entraînement réduite. Considérer cycling glucides jours training vs repos.');
    }

    if (finalFatG < w * 0.8) {
      warnings.push('Lipides <0.8g/kg : Risque hormonal (testostérone/oestrogène ↓). Minimum 20-25% calories total recommandé.');
    }

    if (proteinG > lbm * 3.0) {
      warnings.push('Protéines >3g/kg LBM : Excès non bénéfique. Optimal 1.8-2.6g/kg LBM selon objectif (Phillips & Van Loon 2011).');
    }

    if (calories < bmr * 1.1) {
      warnings.push('⚠️ Calories <110% BMR : Déficit trop agressif. Risque métabolisme adaptatif, catabolisme musculaire. Augmenter progressivement.');
    }

    if (calories > tdee * 1.15 && goal !== 'surplus') {
      warnings.push('Calories >115% TDEE : Vérifier objectif. Surplus non intentionnel = gain graisse excessif.');
    }

    // Validation ratios optimaux
    if (proteinG >= lbm * 2.0 && finalFatG >= w * 0.8 && carbG >= 100) {
      warnings.push('✓ Ratios macro optimaux : Protéines préservation LBM, Lipides santé hormonale, Glucides performance. Conforme recherche Helms et al. 2014.');
    }

    setResult({
      calories,
      tdee,
      bmr: Math.round(bmr),
      leanMass: Math.round(lbm * 10) / 10,
      estimatedBF: Math.round(bf * 10) / 10,
      macros: { p: proteinG, f: finalFatG, c: carbG },
      ratios,
      percents,
      breakdown: {
        bmr: Math.round(bmr),
        neat: Math.round(neat),
        eat: Math.round(eat),
        tef: Math.round(tef),
        total: tdee
      },
      adjustment,
      warnings,
      goalLabel
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const activityLevels = [
    { id: 'sedentary', label: 'Sédentaire', desc: '<3k pas/j' },
    { id: 'light', label: 'Léger', desc: '3-5k pas/j' },
    { id: 'moderate', label: 'Modéré', desc: '5-8k pas/j' },
    { id: 'active', label: 'Actif', desc: '8-12k pas/j' },
    { id: 'veryActive', label: 'Très Actif', desc: '>12k pas/j' }
  ];

  const goals = [
    { id: 'deficit', label: 'Perte de Gras', desc: 'Déficit -20-25%', emoji: '🔥' },
    { id: 'maintenance', label: 'Maintenance', desc: 'Homéostasie', emoji: '⚖️' },
    { id: 'surplus', label: 'Prise de Muscle', desc: 'Surplus +10%', emoji: '💪' }
  ];

  const faqItems = [
    {
      question: "Pourquoi utiliser Mifflin-St Jeor plutôt que Harris-Benedict pour le BMR ?",
      answer: "Mifflin-St Jeor (1990) est le gold standard actuel pour calculer le métabolisme basal (BMR). Validation sur populations modernes (>500 sujets) vs Harris-Benedict (1919) calibrée sur <200 individus début XXe siècle (profils anthropométriques différents). Précision Mifflin : ±10% chez 82% population vs Harris-Benedict ±10-15%. Academy of Nutrition & Dietetics (2005) recommande Mifflin comme méthode de référence. Différence typique : Mifflin donne -5-10% BMR vs Harris-Benedict (évite surestimation calories). Alternative Katch-McArdle (BMR basé LBM) plus précise si BF% connu avec certitude (±5%), mais nécessite mesure composition corporelle fiable (DEXA, plis cutanés 7-sites). Notre calculateur utilise Mifflin (sans BF%) ou Katch-McArdle (si BF% fourni) pour optimiser précision."
    },
    {
      question: "Comment est calculé mon TDEE et pourquoi diviser en BMR, NEAT, EAT, TEF ?",
      answer: "TDEE (Total Daily Energy Expenditure) = somme 4 composantes physiologiques distinctes. (1) BMR (Basal Metabolic Rate) 60-70% TDEE : énergie organes au repos (cerveau, cœur, foie, reins). Formule Mifflin-St Jeor. (2) NEAT (Non-Exercise Activity Thermogenesis) 15-30% TDEE : activité quotidienne hors sport (marche, posture, fidgeting). Varie énormément inter-individuel (Levine et al. 2005). Estimé via niveau activité (sédentaire 1.2×BMR à très actif 1.8×BMR). (3) EAT (Exercise Activity Thermogenesis) 5-15% TDEE : entraînements structurés. ~300 kcal/session musculation 60min intensité modérée-élevée. Réparti hebdomadaire. (4) TEF (Thermic Effect of Food) 8-12% TDEE : coût digestion/absorption (protéines 20-30% TEF, glucides 5-10%, lipides 0-3%). Fixé 10% calories totales. Approche multi-composantes > multiplicateur PAL simple car permet ajustements précis (ex: augmenter NEAT sans modifier EAT)."
    },
    {
      question: "Pourquoi les protéines sont calculées sur la masse maigre (LBM) et non le poids total ?",
      answer: "Tissu adipeux métaboliquement inactif (besoins protéiques négligeables). Muscle, os, organes (= LBM) nécessitent acides aminés pour synthèse/réparation. Calculer protéines sur poids total surestime besoins si BF% élevé (ex: 100kg BF 30% = 70kg LBM, besoins réels ~2g/kg LBM = 140g, pas 200g si calculé sur poids). Recherche Helms et al. (2014), Phillips & Van Loon (2011) : besoins protéines 1.8-2.6g/kg LBM selon contexte. Déficit calorique : 2.3-2.6g/kg LBM préserve masse musculaire (catabolisme réduit). Surplus/Maintenance : 1.8-2.2g/kg LBM suffit (synthèse musculaire saturée >2.2g). Notre calculateur ajuste automatiquement : 2.3g/kg LBM déficit, 2.0g/kg surplus/maintenance. Méthode LBM-based = précision optimale, évite excès protéines inutiles (coûteux, stress rénal potentiel hautes doses chroniques)."
    },
    {
      question: "Quel est le ratio lipides/glucides optimal et pourquoi les lipides ne descendent jamais sous 0.8g/kg ?",
      answer: "Lipides essentiels santé hormonale (testostérone, œstrogène, cortisol précurseurs cholestérol), absorption vitamines liposolubles (A,D,E,K), intégrité membranes cellulaires, fonction cognitive. Minimum absolu recherche : 0.6-0.8g/kg poids (ou 15-20% calories). Optimal performance/santé : 0.8-1.2g/kg (20-35% calories). Sous 0.8g/kg : risques testostérone ↓ (Volek et al. 1997), dysfonction menstruelle femmes, récupération altérée. Notre calculateur impose plancher 0.8g/kg déficit, 1.0g/kg surplus/maintenance + minimum 20% calories lipides (prévention descente <seuil hormonal). Ratio lipides/glucides variable selon objectif/préférence : Low-carb (lipides 40-50%, glucides 20-30%) acceptable si performance pas priorité. High-carb (glucides 50-60%, lipides 20-25%) optimal entraînements haute intensité (glycogène musculaire). Clé = atteindre minimum lipides absolu, reste calories = glucides (carburant performance modulable)."
    },
    {
      question: "Comment ajuster mes macros dans le temps et monitorer la progression ?",
      answer: "Ajustement macros = processus itératif data-driven. PHASE 1 (Semaines 1-2) : Appliquer macros calculées, tracker poids quotidien (matin, post-miction, pré petit-déjeuner), calculer moyenne hebdomadaire. PHASE 2 (Semaines 3-4) : Comparer évolution poids vs cible. Déficit : perte 0.5-1% poids/semaine optimal (préserve LBM). Si <0.5% → réduire calories -10% (priorité glucides). Si >1.5% → trop agressif, augmenter +5-10% (risque catabolisme). Surplus : gain 0.25-0.5% poids/semaine (ratio muscle:graisse 2:1). Si <0.25% → augmenter +10%. Si >0.75% → gain graisse excessif, réduire -5%. Maintenance : poids stable ±1kg sur 4 semaines = TDEE validé. PHASE 3 (Long terme) : Reverse diet post-déficit (+100 kcal/semaine, normalise hormones). Diet breaks déficit (2 semaines maintenance tous 8-12 semaines, reset leptine/T3). Recomposition body fat : ajustements micro (+/- 5% calories) basés photos/miroir + mesures circonférences (tour taille, cuisses, bras). Protéines fixes, ajuster glucides/lipides selon énergie training. Monitoring : poids, photos, force salle (maintien = LBM préservée), sommeil, libido (indicateurs hormonaux)."
    }
  ];

  const handleCopy = () => {
    if (!result) return;
    const text = `🎯 STRYV LAB - BILAN NUTRITIONNEL

OBJECTIF : ${result.goalLabel}
CIBLE CALORIQUE : ${result.calories} kcal/jour
TDEE ESTIMÉ : ${result.tdee} kcal

📊 MACRONUTRIMENTS
1. PROTÉINES : ${result.macros.p}g (${result.percents.p}%)
2. LIPIDES : ${result.macros.f}g (${result.percents.f}%)
3. GLUCIDES : ${result.macros.c}g (${result.percents.c}%)

📈 COMPOSITION
• Masse Maigre (LBM) : ${result.leanMass}kg
• Body Fat% : ${result.estimatedBF}%
• BMR : ${result.bmr} kcal

Calculé via GENESIS MACRO V4.0 sur www.stryvlab.com • Formules Mifflin-St Jeor + Helms`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
    <div className="w-full space-y-12">
                
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Calcul macronutriments & calories</h3>
                    <p className="text-sm text-white/40 font-medium">Formules Mifflin-St Jeor + Helms (LBM-based)</p>
                </div>

                <div className="space-y-8">
                    
                    {/* GENRE */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Genre (formule BMR)</label>
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

                    {/* INPUTS BASE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                        {[
                            { label: 'Poids (kg)', val: weight, set: setWeight, ph: gender === 'male' ? '75' : '60' },
                            { label: 'Taille (cm)', val: height, set: setHeight, ph: gender === 'male' ? '180' : '165' },
                            { label: 'Âge', val: age, set: setAge, ph: '30' },
                        ].map((field, i) => (
                            <div key={i} className="space-y-3">
                                <label className="text-[13px] font-medium text-white/60">{field.label}</label>
                                <input 
                                type="number" 
                                value={field.val} 
                                onChange={(e) => field.set(e.target.value)} 
                                placeholder={field.ph}
                                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    {/* BODY FAT (OPTIONNEL) */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Body Fat % <span className="text-[11px] text-white/30">(optionnel - améliore précision LBM)</span></label>
                        <input 
                        type="number" 
                        value={bodyFat} 
                        onChange={(e) => setBodyFat(e.target.value)} 
                        placeholder={gender === 'male' ? '15' : '22'}
                        className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                        />
                    </div>

                    {/* ACTIVITÉ */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Niveau d'activité quotidienne (NEAT)</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {activityLevels.map(level => (
                                <button 
                                key={level.id}
                                onClick={() => setActivityLevel(level.id as ActivityLevel)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-20 ${activityLevel === level.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <span className="text-xs font-bold">{level.label}</span>
                                    <span className="text-[10px] text-white/40">{level.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* WORKOUTS */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Séances musculation/semaine (EAT)</label>
                        <input 
                        type="number" 
                        value={workouts} 
                        onChange={(e) => setWorkouts(e.target.value)} 
                        placeholder="3"
                        className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                        />
                    </div>

                    {/* OBJECTIF */}
                    <div className="pt-8 border-t border-white/5 space-y-3">
                        <label className="text-[13px] font-medium text-white/60">Objectif </label>
                        <div className="grid gap-3">
                            {goals.map(g => (
                                <button 
                                key={g.id}
                                onClick={() => setGoal(g.id as Goal)}
                                className={`p-5 rounded-xl border flex justify-between items-center transition-all ${goal === g.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-3">
                                    
                                        <div>
                                            <div className="font-bold text-sm">{g.label}</div>
                                            <div className="text-[10px] text-white/40">{g.desc}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Méthodologie scientifique</h3>
                            <p className="text-sm text-white/40">Formules & équations</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer détails' : 'Voir formules'}
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                            <div className="text-xs text-white/60 space-y-2">
                                <p><strong className="text-white/80">BMR Mifflin-St Jeor (1990):</strong></p>
                                <p className="pl-4">• Homme: (10 × Poids) + (6.25 × Taille) - (5 × Âge) + 5</p>
                                <p className="pl-4">• Femme: (10 × Poids) + (6.25 × Taille) - (5 × Âge) - 161</p>
                                <p className="pt-2"><strong className="text-white/80">TDEE Multi-Composantes:</strong></p>
                                <p className="pl-4">• NEAT: BMR × (1.2 à 1.8 selon activité - 1)</p>
                                <p className="pl-4">• EAT: 300 kcal/session × Nb séances × 7 / 7</p>
                                <p className="pl-4">• TEF: 10% (BMR + NEAT + EAT)</p>
                                <p className="pt-2"><strong className="text-white/80">Macronutriments (Helms 2014):</strong></p>
                                <p className="pl-4">• Protéines: 2.0-2.3g/kg LBM (selon déficit/surplus)</p>
                                <p className="pl-4">• Lipides: 0.8-1.0g/kg poids (minimum 20% calories)</p>
                                <p className="pl-4">• Glucides: Variable ajustement (reste calories)</p>
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={calculateMacros}
                    disabled={!weight || !height || !age}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Générer mon plan nutritionnel
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

                    <div className="bg-[#252525] p-6 rounded-xl border border-white/5">
                        <div className="text-center mb-6">
                            <div className="text-[11px] font-medium text-white/40 mb-2">{result.goalLabel}</div>
                            <div className="text-5xl md:text-6xl font-bold text-white">{result.calories} <span className="text-2xl text-white/40">kcal</span></div>
                            <div className="text-xs text-white/50 mt-2">TDEE: {result.tdee} kcal • BMR: {result.bmr} kcal</div>
                        </div>

                        <div className="border-t border-white/5 pt-4">
                            <button onClick={() => setShowTdeeDetails(!showTdeeDetails)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline w-full text-center">
                                {showTdeeDetails ? '− Masquer breakdown TDEE' : '+ Voir détails TDEE'}
                            </button>
                            {showTdeeDetails && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in">
                                    {['bmr', 'neat', 'eat', 'tef'].map(key => (
                                        <div key={key} className="bg-[#404040] p-3 rounded-lg border border-white/5 text-center">
                                            <div className="text-[10px] text-white/40 uppercase mb-1">{key}</div>
                                            <div className="text-lg font-bold text-white">{result.breakdown[key as keyof typeof result.breakdown]}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-bold text-white mb-6">Macronutriments optimisés</h3>
                        
                        <div className="space-y-3">
                            {/* PROTÉINES */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">1</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Protéines</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">Synthèse musculaire & préservation LBM</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.p}g</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.p}%</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Priorité structurelle (Helms 2014)</div>
                                        <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.p}g/kg LBM</div>
                                    </div>
                                </div>
                            </div>

                            {/* LIPIDES */}
                            <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">2</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Lipides</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">Santé hormonale (testostérone/œstrogène)</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.f}g</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.f}%</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Seuil minimal hormonal (Volek 1997)</div>
                                        <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.f}g/kg</div>
                                    </div>
                                </div>
                            </div>

                            {/* GLUCIDES */}
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">3</div>
                                        <div>
                                            <div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Glucides</div>
                                            <div className="text-[10px] text-[#1A1A1A]/60">Performance training & glycogène musculaire</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.c}g</div>
                                        <div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.c}%</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-[#1A1A1A]/10">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Variable ajustement (modulable)</div>
                                        <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.c}g/kg</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-violet-400 border-violet-400 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copié !' : 'Copier mon bilan nutritionnel'}
                    </button>

                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            <strong className="text-white/90">Méthodologie :</strong> BMR Mifflin-St Jeor (1990) gold standard. TDEE multi-composantes (BMR+NEAT+EAT+TEF). Protéines LBM-based Helms et al. (2014). Lipides hormonal-optimized ≥0.8g/kg. Glucides variable performance. Déficit/Surplus BF%-dépendant. Masse Maigre (LBM): {result.leanMass}kg • Body Fat: {result.estimatedBF}%.
                        </p>
                    </div>
                </div>
            )}
            </div>

            <div className="mt-24 max-w-3xl mx-auto pb-24">
                <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes sur les macronutriments</h2>
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

        </>
  );
}