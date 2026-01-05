'use client';

import { useState, useRef } from 'react';
import { Utensils, ChevronDown, Copy, Check } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

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
    setCopied(false);
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
      warnings.push(`Body Fat% estimé (${bf.toFixed(1)}%) via formule Deurenberg. Pour précision optimale, mesurez votre BF% réel.`);
    }

    // 2. LEAN BODY MASS (LBM)
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
      sedentary: 1.2,
      light: 1.35,
      moderate: 1.5,
      active: 1.65,
      veryActive: 1.8
    };
    const neat = bmr * (activityMultipliers[activityLevel] - 1);

    // 5. EAT (Exercise Activity Thermogenesis)
    const eatPerWorkout = 300; // Moyenne 60min session
    const eat = (eatPerWorkout * wo * 7) / 7;

    // 6. TEF (Thermic Effect of Food)
    const preTdee = bmr + neat + eat;
    const tef = preTdee * 0.10;

    // 7. TDEE TOTAL
    const tdee = Math.round(bmr + neat + eat + tef);

    // 8. AJUSTEMENT SELON OBJECTIF
    let adjustment = 0;
    let calories = tdee;
    let goalLabel = '';

    if (goal === 'deficit') {
      const isObese = (gender === 'male' && bf > 25) || (gender === 'female' && bf > 32);
      adjustment = isObese ? -25 : -20;
      calories = Math.round(tdee * (1 + adjustment / 100));
      goalLabel = 'Perte de Gras (Déficit Stratifié)';
      warnings.push(`Déficit ${Math.abs(adjustment)}% (${Math.abs(calories - tdee)} kcal/j).`);
    } else if (goal === 'surplus') {
      adjustment = 10;
      calories = Math.round(tdee * 1.10);
      goalLabel = 'Prise de Muscle (Lean Bulk)';
      warnings.push(`Surplus +10% (${calories - tdee} kcal/j).`);
    } else {
      goalLabel = 'Maintenance (Homéostasie)';
      warnings.push(`Maintenance calorique.`);
    }

    // 9. MACRONUTRIMENTS (Formules Elite)
    let proteinGKg: number;
    if (goal === 'deficit') {
      proteinGKg = 2.3; 
    } else if (goal === 'surplus') {
      proteinGKg = 2.0;
    } else {
      proteinGKg = 2.0;
    }
    const proteinG = Math.round(lbm * proteinGKg);

    const fatGKg = goal === 'deficit' ? 0.8 : 1.0;
    const fatG = Math.round(w * fatGKg);
    const fatMinCalories = calories * 0.20;
    const finalFatG = Math.max(Math.round(fatMinCalories / 9), fatG);

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

    // Validation ratios optimaux
    if (carbG < 100 && goal !== 'deficit') warnings.push('Glucides <100g : Risque performance entraînement réduite.');
    if (finalFatG < w * 0.8) warnings.push('Lipides <0.8g/kg : Risque hormonal.');
    if (calories < bmr * 1.1) warnings.push('⚠️ Calories <110% BMR : Déficit trop agressif.');

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

  // --- DATA ---
  const activityLevels = [
    { id: 'sedentary', label: 'Sédentaire', desc: '<3k pas/j' },
    { id: 'light', label: 'Léger', desc: '3-5k pas/j' },
    { id: 'moderate', label: 'Modéré', desc: '5-8k pas/j' },
    { id: 'active', label: 'Actif', desc: '8-12k pas/j' },
    { id: 'veryActive', label: 'Très Actif', desc: '>12k pas/j' }
  ];

  const goals = [
    { id: 'deficit', label: 'Perte de Gras', desc: 'Déficit -20-25%' },
    { id: 'maintenance', label: 'Maintenance', desc: 'Homéostasie' },
    { id: 'surplus', label: 'Prise de Muscle', desc: 'Surplus +10%' }
  ];

  const faqItems = [
    {
      question: "Pourquoi utiliser Mifflin-St Jeor plutôt que Harris-Benedict pour le BMR ?",
      answer: "Mifflin-St Jeor (1990) est le gold standard actuel pour calculer le métabolisme basal (BMR). Validation sur populations modernes (>500 sujets) vs Harris-Benedict (1919) calibrée sur <200 individus début XXe siècle. Précision Mifflin : ±10% chez 82% population."
    },
    {
      question: "Pourquoi les protéines sont calculées sur la masse maigre (LBM) ?",
      answer: "Tissu adipeux métaboliquement inactif. Muscle, os, organes (= LBM) nécessitent acides aminés. Calculer sur poids total surestime besoins si BF% élevé. Helms et al. (2014) recommandent 1.8-2.6g/kg LBM."
    },
    {
      question: "Quel est le ratio lipides/glucides optimal ?",
      answer: "Lipides essentiels santé hormonale (testostérone). Minimum absolu recherche : 0.6-0.8g/kg poids. Notre calculateur impose un plancher 0.8g/kg déficit. Le reste des calories est alloué aux glucides pour la performance."
    }
  ];

  // --- FONCTION DE COPIE ---
  const handleCopy = () => {
    if (!result) return;
    const url = 'https://www.stryvlab.com/outils/macros';

    const text = `Bilan Nutritionnel - STRYV LAB

• Objectif : ${result.goalLabel}
• Cible : ${result.calories} kcal/jour
• TDEE : ${result.tdee} kcal

Macros Optimisées :
• Protéines : ${result.macros.p}g (${result.ratios.p}g/kg LBM)
• Lipides : ${result.macros.f}g (${result.ratios.f}g/kg)
• Glucides : ${result.macros.c}g (${result.ratios.c}g/kg)

Composition :
• Masse Maigre : ${result.leanMass} kg
• Body Fat : ${result.estimatedBF}%

Retrouvez cet outil ici : ${url}`;

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
                <label className="text-[13px] font-medium text-white/60">Genre</label>
                <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                    {(['male', 'female'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${gender === g ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}>{g === 'male' ? 'Homme' : 'Femme'}</button>
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
                        <input type="number" value={field.val} onChange={(e) => field.set(e.target.value)} placeholder={field.ph} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                    </div>
                ))}
            </div>

            {/* BODY FAT */}
            <div className="pt-8 border-t border-white/5 space-y-3">
                <label className="text-[13px] font-medium text-white/60">Body Fat % <span className="text-[11px] text-white/30">(optionnel)</span></label>
                <input type="number" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} placeholder={gender === 'male' ? '15' : '22'} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
            </div>

            {/* ACTIVITÉ */}
            <div className="pt-8 border-t border-white/5 space-y-3">
                <label className="text-[13px] font-medium text-white/60">Niveau d'activité quotidienne (NEAT)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {activityLevels.map(level => (
                        <button key={level.id} onClick={() => setActivityLevel(level.id as ActivityLevel)} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-20 ${activityLevel === level.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}>
                            <span className="text-xs font-bold">{level.label}</span>
                            <span className="text-[10px] text-white/40">{level.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* WORKOUTS */}
            <div className="pt-8 border-t border-white/5 space-y-3">
                <label className="text-[13px] font-medium text-white/60">Séances musculation/semaine (EAT)</label>
                <input type="number" value={workouts} onChange={(e) => setWorkouts(e.target.value)} placeholder="3" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
            </div>

            {/* OBJECTIF */}
            <div className="pt-8 border-t border-white/5 space-y-3">
                <label className="text-[13px] font-medium text-white/60">Objectif</label>
                <div className="grid gap-3">
                    {goals.map(g => (
                        <button key={g.id} onClick={() => setGoal(g.id as Goal)} className={`p-5 rounded-xl border flex justify-between items-center transition-all ${goal === g.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}>
                            <div><div className="font-bold text-sm">{g.label}</div><div className="text-[10px] text-white/40">{g.desc}</div></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-8">
            <div className="flex items-center justify-between">
                <div><h3 className="text-lg font-bold text-white mb-1">Méthodologie scientifique</h3><p className="text-sm text-white/40">Formules & équations</p></div>
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">{showAdvanced ? 'Masquer détails' : 'Voir formules'}</button>
            </div>
            {showAdvanced && (
                <div className="bg-[#252525] border border-white/5 rounded-xl p-5 space-y-3 animate-in fade-in">
                    <div className="text-xs text-white/60 space-y-2">
                        <p><strong className="text-white/80">BMR Mifflin-St Jeor:</strong> Poids, Taille, Âge.</p>
                        <p><strong className="text-white/80">TDEE:</strong> BMR + NEAT + EAT + TEF (10%).</p>
                        <p><strong className="text-white/80">Macros (Helms 2014):</strong> Protéines sur LBM, Lipides sur poids total, Glucides en variable.</p>
                    </div>
                </div>
            )}
        </div>

        <button onClick={calculateMacros} disabled={!weight || !height || !age} className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">Générer mon bilan nutritionnel</button>
    </div>

    <div ref={resultsRef}>
    {result && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
            {result.warnings.length > 0 && (
                <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                    {result.warnings.map((w, i) => <div key={i} className="text-sm text-white/90 font-medium">• {w}</div>)}
                </div>
            )}

            <div className="bg-[#252525] p-6 rounded-xl border border-white/5">
                <div className="text-center mb-6">
                    <div className="text-[11px] font-medium text-white/40 mb-2">{result.goalLabel}</div>
                    <div className="text-5xl md:text-6xl font-bold text-white">{result.calories} <span className="text-2xl text-white/40">kcal</span></div>
                    <div className="text-xs text-white/50 mt-2">TDEE: {result.tdee} kcal • BMR: {result.bmr} kcal</div>
                </div>
                <div className="border-t border-white/5 pt-4">
                    <button onClick={() => setShowTdeeDetails(!showTdeeDetails)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline w-full text-center">{showTdeeDetails ? '− Masquer breakdown TDEE' : '+ Voir détails TDEE'}</button>
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
                                <div><div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Protéines</div><div className="text-[10px] text-[#1A1A1A]/60">Synthèse musculaire</div></div>
                            </div>
                            <div className="text-right"><div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.p}g</div><div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.p}%</div></div>
                        </div>
                        <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center">
                            <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Priorité structurelle</div>
                            <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.p}g/kg LBM</div>
                        </div>
                    </div>
                    {/* LIPIDES */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/50 p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">2</div>
                                <div><div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Lipides</div><div className="text-[10px] text-[#1A1A1A]/60">Santé hormonale</div></div>
                            </div>
                            <div className="text-right"><div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.f}g</div><div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.f}%</div></div>
                        </div>
                        <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center">
                            <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Seuil minimal</div>
                            <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.f}g/kg</div>
                        </div>
                    </div>
                    {/* GLUCIDES */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-[#1A1A1A] shadow-sm">3</div>
                                <div><div className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Glucides</div><div className="text-[10px] text-[#1A1A1A]/60">Performance</div></div>
                            </div>
                            <div className="text-right"><div className="font-bold text-2xl text-[#1A1A1A]">{result.macros.c}g</div><div className="text-[9px] text-[#1A1A1A]/50 uppercase">{result.percents.c}%</div></div>
                        </div>
                        <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center">
                            <div className="text-[10px] text-[#1A1A1A]/70 font-medium">Variable ajustement</div>
                            <div className="text-[10px] font-bold bg-white px-2 py-1 rounded-md shadow-sm text-[#1A1A1A]">{result.ratios.c}g/kg</div>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={handleCopy} className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-blue-400 border-blue-400 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copié !' : 'Copier mon bilan nutritionnel'}
            </button>

            <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                    <strong className="text-white/90">Méthodologie :</strong> BMR Mifflin-St Jeor (1990). TDEE multi-composantes. Protéines LBM-based. Lipides hormonal-optimized.
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
                    <button onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left font-medium text-sm text-white hover:bg-white/5 transition-colors">
                        <span className="pr-4">{item.question}</span>
                        <ChevronDown className={`flex-shrink-0 w-4 h-4 text-white/40 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaqIndex === i && <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-4">{item.answer}</div>}
                </div>
            ))}
        </div>
    </div>
    <GenesisAssistant />
    </>
  );
}