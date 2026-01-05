'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft, ChevronDown, Copy, Check } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// --- TYPES ---
type Protocol = '2/1' | '3/1' | '4/1' | '5/2';
type Goal = 'aggressive' | 'moderate' | 'recomp' | 'performance' | 'bulk';
type Sex = 'male' | 'female';
type Activity = 'sedentaire' | 'debout' | 'physique';
type Intensity = 'legere' | 'moderee' | 'intense' | 'tres_intense';
type Phase = 'hypertrophie' | 'force' | 'endurance' | 'cut';
type Insulin = 'elevee' | 'normale' | 'reduite';

export default function CarbCyclingCalculator() {
  // --- STATES ---
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hips, setHips] = useState('');
  
  const [occupation, setOccupation] = useState<Activity>('sedentaire');
  const [sessionsPerWeek, setSessionsPerWeek] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('moderee');
  
  const [goal, setGoal] = useState<Goal>('moderate');
  const [phase, setPhase] = useState<Phase>('hypertrophie');
  const [protocol, setProtocol] = useState<Protocol>('3/1');
  
  const [insulin, setInsulin] = useState<Insulin>('normale');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false); // État pour le bouton copier
  const resultsRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<{
    bmr: number;
    pal: number;
    tdee: number;
    targetTdee: number;
    bf: number;
    lbm: number;
    low: { p: number; f: number; c: number; kcal: number };
    high: { p: number; f: number; c: number; kcal: number };
    days: { low: number; high: number };
    weeklyAvg: number;
    deficit: number;
    warnings: string[];
  } | null>(null);

  // --- LOGIC ---
  const calculateCycle = () => {
    setCopied(false);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) return;

    // 1. BMR
    let bmr = (sex === 'male') ? (10 * w) + (6.25 * h) - (5 * a) + 5 : (10 * w) + (6.25 * h) - (5 * a) - 161;

    // 2. PAL
    const occupationFactors = { sedentaire: 1.2, debout: 1.35, physique: 1.5 };
    const intensityFactors = { legere: 0.3, moderee: 0.5, intense: 0.7, tres_intense: 1.0 };
    const sessions = parseFloat(sessionsPerWeek) || 0;
    const duration = parseFloat(sessionDuration) || 0;
    const trainingBonus = 1 + ((sessions * duration * intensityFactors[intensity]) / 10000);
    const pal = occupationFactors[occupation] * trainingBonus;

    // 3. TDEE & Target
    const tdee = bmr * pal;
    const goalAdjustments = { aggressive: 0.80, moderate: 0.85, recomp: 1.00, performance: 1.10, bulk: 1.15 };
    const targetTdee = tdee * goalAdjustments[goal];

    // 4. BF & LBM
    let bf = 0;
    if (bodyFat && parseFloat(bodyFat) > 0) {
      bf = parseFloat(bodyFat);
    } else {
      const waistCm = parseFloat(waist) || 0;
      const neckCm = parseFloat(neck) || 0;
      const hipsCm = parseFloat(hips) || 0;
      if (sex === 'male' && waistCm && neckCm && h) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(h)) - 450;
      } else if (sex === 'female' && waistCm && neckCm && hipsCm && h) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipsCm - neckCm) + 0.22100 * Math.log10(h)) - 450;
      } else {
        bf = sex === 'male' ? 15 : 25;
      }
    }
    const lbm = w * (1 - bf / 100);

    // 5. Protocole
    let daysLow = 3, daysHigh = 1;
    if (protocol === '2/1') { daysLow = 2; daysHigh = 1; }
    if (protocol === '4/1') { daysLow = 4; daysHigh = 1; }
    if (protocol === '5/2') { daysLow = 5; daysHigh = 2; }

    let pLowRatio = (goal === 'aggressive' || goal === 'moderate') ? 3.0 : (goal === 'recomp' ? 2.6 : 2.4);
    let pHighRatio = (goal === 'aggressive' || goal === 'moderate') ? 2.6 : (goal === 'recomp' ? 2.4 : 2.6);

    const minFat = sex === 'male' ? Math.max(0.8 * w, 50) : Math.max(1.0 * w, 60);
    const phaseAdjustments = { hypertrophie: 1.1, force: 1.0, endurance: 1.3, cut: 0.8 };
    const insulinAdjustments = { elevee: 1.2, normale: 1.0, reduite: 0.8 };
    
    const totalCycle = daysLow + daysHigh;
    const highDayMultiplier = intensity === 'tres_intense' ? 1.5 : intensity === 'intense' ? 1.4 : 1.3;
    const kcalHigh = (targetTdee * totalCycle * highDayMultiplier) / totalCycle;
    const kcalLow = (targetTdee * totalCycle - (kcalHigh * daysHigh)) / daysLow;

    const pLow = Math.round(lbm * pLowRatio);
    // CORRECTION BUG LIPIDES : Ajout de Math.round() pour éviter les décimales
    let fLow = Math.round(Math.max(w * 1.0, minFat)); 
    
    const remainingLow = kcalLow - (pLow * 4) - (fLow * 9);
    let cLow = Math.max(Math.round(remainingLow / 4), 30);
    
    if (remainingLow < 0) { 
        fLow = Math.round((kcalLow - (pLow * 4) - 120) / 9); 
        cLow = 30; 
    }

    const pHigh = Math.round(lbm * pHighRatio);
    // CORRECTION BUG LIPIDES : Ajout de Math.round() ici aussi
    const fHigh = Math.round(Math.max(w * 0.5, minFat)); 
    
    const remainingHigh = kcalHigh - (pHigh * 4) - (fHigh * 9);
    let cHigh = Math.round((remainingHigh / 4) * insulinAdjustments[insulin] * phaseAdjustments[phase]);

    // Warnings
    const warnings: string[] = [];
    if (cHigh / w > 12) warnings.push("Glucides >12g/kg (Risque digestif). Considérez un protocole 5/2.");
    if (fLow < minFat * 0.9) warnings.push("Lipides sous le seuil hormonal minimum.");
    if (((tdee - targetTdee) / tdee) > 0.25) warnings.push("Déficit >25% (Risque de catabolisme élevé).");

    const weeklyAvg = Math.round((kcalLow * daysLow + kcalHigh * daysHigh) / totalCycle);
    const deficit = weeklyAvg - Math.round(tdee);

    setResult({
      bmr: Math.round(bmr), pal: Math.round(pal * 100) / 100, tdee: Math.round(tdee), targetTdee: Math.round(targetTdee),
      bf: Math.round(bf * 10) / 10, lbm: Math.round(lbm * 10) / 10,
      low: { p: pLow, f: fLow, c: cLow, kcal: Math.round(kcalLow) },
      high: { p: pHigh, f: fHigh, c: cHigh, kcal: Math.round(kcalHigh) },
      days: { low: daysLow, high: daysHigh }, weeklyAvg, deficit, warnings
    });

    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const getGoalLabel = (g: Goal) => {
    const labels = { aggressive: 'Fat loss agressif', moderate: 'Fat loss modéré', recomp: 'Recomposition', performance: 'Performance', bulk: 'Prise de masse' };
    return labels[g];
  };

  // --- FONCTION DE COPIE ---
  const handleCopy = () => {
    if (!result) return;
    
    const url = 'https://www.stryvlab.com/outils/carb-cycling';

    const textToCopy = `Bilan Carb Cycling - STRYV LAB

• Objectif : ${getGoalLabel(goal)}
• Protocole : ${protocol} (${result.days.low} Low / ${result.days.high} High)
• Maintenance : ${result.tdee} kcal

⚡️ JOURS HAUTS (Training) : ${result.high.kcal} kcal
• P: ${result.high.p}g • G: ${result.high.c}g • L: ${result.high.f}g

💤 JOURS BAS (Repos) : ${result.low.kcal} kcal
• P: ${result.low.p}g • G: ${result.low.c}g • L: ${result.low.f}g

Retrouvez cet outil ici : ${url}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    { 
      question: "Qu'est-ce que le carb cycling et pourquoi utiliser la masse maigre (LBM) ?", 
      answer: "Le carb cycling est une stratégie nutritionnelle qui alterne entre jours à glucides élevés (jours d'entraînement) et jours à glucides bas (jours de repos) pour optimiser la perte de graisse tout en préservant le muscle. Notre calculateur utilise votre masse maigre (LBM - Lean Body Mass) et non votre poids total car les protéines doivent être calculées selon vos muscles actifs. Un individu de 100kg à 30% BF (70kg LBM) n'a pas les mêmes besoins qu'un individu de 100kg à 10% BF (90kg LBM). Standards Dr. Layne Norton et ISSN (International Society of Sports Nutrition)." 
    },
    { 
      question: "Comment choisir mon protocole de carb cycling (2/1, 3/1, 4/1, 5/2) ?", 
      answer: "Le choix du protocole dépend de votre pourcentage de masse grasse et de votre niveau d'activité. Plus votre %BF est élevé, plus vous bénéficierez de jours bas fréquents (protocole 5/2 ou 4/1). Si vous êtes déjà sec (<12% hommes, <20% femmes) et très actif, vous tolérez plus de jours de recharge glucidique (protocole 2/1 ou 3/1). Le protocole 3/1 est le plus polyvalent pour la majorité des pratiquants." 
    },
    { 
      question: "Quand placer mes entraînements avec le carb cycling ?", 
      answer: "Synchronisez impérativement vos séances les plus volumineuses et intenses (Jambes, Dos, séances compound) avec vos Jours Hauts en glucides. Le glycogène musculaire rechargé maximisera votre performance et protégera votre masse musculaire. Placez les jours de repos, cardio léger ou séances accessoires lors des Jours Bas pour favoriser l'oxydation des graisses." 
    },
    {
      question: "Pourquoi ce calculateur est-il plus précis que les autres ?",
      answer: "Contrairement aux calculateurs standards qui utilisent des ratios fixes ou le poids total, notre outil forensic utilise : BMR Mifflin-St Jeor (gold standard, ±10% précision vs ±20% Harris-Benedict), PAL personnalisé combinant occupation ET entraînement, protéines calculées sur LBM (méthode Norton/ISSN), lipides minimums hormonaux sexe-dépendants (0.8g/kg homme, 1.0g/kg femme), et ajustements selon sensibilité insulinique et phase d'entraînement."
    },
    {
      question: "Le carb cycling fonctionne-t-il vraiment pour la perte de graisse ?",
      answer: "Le carb cycling n'a pas d'avantage métabolique direct sur la perte de graisse comparé à un déficit calorique constant (Dr. Layne Norton, 2024). Son efficacité réside dans l'adhérence psychologique et la préservation de la performance. Les jours hauts maintiennent la leptine temporairement et permettent des entraînements de qualité, tandis que les jours bas créent le déficit nécessaire. L'essentiel reste la moyenne calorique hebdomadaire."
    }
  ];

  return (
    <>
      <main className="flex flex-col lg:flex-row min-h-screen font-outfit text-white">
        
        {/* ================= GAUCHE (Intacte) ================= */}
        <section className="w-full lg:w-5/12 lg:max-w-[500px] bg-[#1A1A1A] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[40vh] lg:min-h-screen lg:sticky lg:top-0 border-r border-white/5 shadow-2xl z-20">
          <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none select-none">
             <RefreshCw className="w-80 h-80 stroke-[0.5]" />
          </div>
          <div className="relative z-10">
            <Link href="/outils" className="group inline-flex items-center text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-12 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Hub
            </Link>
            <div className="flex flex-col items-start gap-6 mb-10">
              <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] flex items-center justify-center text-white">
                     <RefreshCw className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/10 px-3 py-1 rounded-full bg-white/5">Glycogène</span>
              </div>
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-azonix italic uppercase tracking-tighter mb-8 leading-[0.9]">
              Carb Cycling
            </h1>

            <div className="space-y-6 border-t border-white/5 pt-6">
              <div>
                <h2 className="text-white/90 text-base font-bold mb-3 tracking-tight">La Stratégie Cyclique</h2>
                <p className="text-white/50 text-[13px] leading-relaxed font-light">
                  Votre corps ne dépense pas la même énergie tous les jours. Votre nutrition ne devrait pas être linéaire non plus.
                </p>
              </div>

              <div className="text-white/50 text-[13px] leading-relaxed font-light space-y-3">
                <p>Ce calculateur ajuste vos apports en glucides selon votre activité réelle :</p>
                
                <div className="space-y-2 pl-4 border-l-2 border-orange-500/30">
                  <p><strong className="text-white/70">• Jours Hauts (High Days)</strong> : On recharge les batteries (glycogène) pour soutenir vos entraînements intenses et protéger votre muscle.</p>
                  <p><strong className="text-white/70">• Jours Bas (Low Days)</strong> : On force votre corps à puiser dans ses graisses au repos.</p>
                </div>

                <p className="pt-2">
                  Contrairement aux outils classiques, nous basons les calculs sur votre <strong className="text-white/90">masse maigre</strong> (vos muscles) et non votre poids total, pour un résultat beaucoup plus fiable.
                </p>

                <p className="text-[11px] text-white/40 pt-3 border-t border-white/5">
                  Protocole validé ISSN & Dr. Layne Norton
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-12 md:mt-0 flex justify-between items-end text-white/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Stryv Lab</p>
            <span className="font-azonix text-xs opacity-30">V4.0</span>
          </div>
        </section>

        {/* ================= DROITE ================= */}
        <section className="flex-1 relative overflow-y-auto py-8 px-4 md:px-8 lg:py-16 bg-[#303030]">
            <div className="max-w-3xl mx-auto space-y-12">
                
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-lg font-bold text-white mb-1">Paramètres biométriques</h3>
                    <p className="text-sm text-white/40 font-medium">Saisie des données physiologiques</p>
                </div>

                {/* 1. INPUTS BIOMÉTRIQUES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Sexe</label>
                            <div className="flex gap-2 p-1 bg-[#252525] rounded-xl border border-white/5">
                                {['male', 'female'].map(s => (
                                    <button 
                                    key={s} 
                                    onClick={() => setSex(s as Sex)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${sex === s ? 'bg-[#404040] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                    >
                                        {s === 'male' ? 'Homme' : 'Femme'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {[
                            { label: 'Âge (ans)', val: age, set: setAge, ph: '30' },
                            { label: 'Poids (kg)', val: weight, set: setWeight, ph: '75.5' },
                            { label: 'Taille (cm)', val: height, set: setHeight, ph: '180' },
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

                {/* 2. COMPOSITION */}
                <div className="pt-8 border-t border-white/5 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Composition corporelle</h3>
                            <p className="text-sm text-white/40">Méthode Forensic (Optionnel)</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[13px] font-medium text-white/60 flex justify-between">
                                <span>% Body fat estimé</span>
                                </label>
                                <input 
                                type="number" 
                                value={bodyFat} 
                                onChange={(e) => setBodyFat(e.target.value)} 
                                placeholder="Ex: 14.5"
                                className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all"
                                />
                            </div>

                            <div className="p-5 bg-[#252525] rounded-xl border border-white/5 flex items-start gap-3">
                                <p className="text-xs text-white/60 leading-relaxed font-medium">
                                    Si BF% inconnu, remplissez les mensurations. L'algorithme utilisera la méthode US Navy.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { l: 'Tour taille', v: waist, s: setWaist },
                                { l: 'Tour cou', v: neck, s: setNeck },
                                ...(sex === 'female' ? [{ l: 'Tour hanches', v: hips, s: setHips }] : [])
                            ].map((m, i) => (
                                <div key={i} className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">{m.l} (cm)</label>
                                    <input 
                                    type="number" 
                                    value={m.v} 
                                    onChange={(e) => m.s(e.target.value)}
                                    className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-3 text-base font-medium text-white outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                </div>

                {/* 3. ACTIVITÉ & OBJECTIFS */}
                <div className="pt-8 border-t border-white/5 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Dépense & objectif</h3>
                            <p className="text-sm text-white/40">Définition du métabolisme total</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { id: 'sedentaire', l: 'Bureau', d: 'Assis >6h' },
                                { id: 'debout', l: 'Actif', d: 'Marche régulière' },
                                { id: 'physique', l: 'Intense', d: 'Construction/Sport' }
                            ].map(item => (
                                <button
                                key={item.id}
                                onClick={() => setOccupation(item.id as Activity)}
                                className={`p-4 rounded-xl border text-left transition-all duration-200 ${occupation === item.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <div className="text-sm font-bold mb-1">{item.l}</div>
                                    <div className={`text-[11px] ${occupation === item.id ? 'text-white/80' : 'text-white/30'}`}>{item.d}</div>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Séances / semaine</label>
                            <input type="number" value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 font-medium text-white outline-none focus:border-white/30" placeholder="4" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Durée moyenne (min)</label>
                            <input type="number" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 font-medium text-white outline-none focus:border-white/30" placeholder="60" />
                        </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-white/60">Objectif actuel</label>
                            <div className="relative">
                                <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full appearance-none bg-[#252525] border border-white/5 rounded-xl px-4 py-4 font-medium text-white outline-none focus:border-white/30 cursor-pointer text-sm">
                                    <option value="aggressive">Perte agressive (-20%)</option>
                                    <option value="moderate">Perte modérée (-15%)</option>
                                    <option value="recomp">Recomposition (Maintenance)</option>
                                    <option value="performance">Performance (+10%)</option>
                                    <option value="bulk">Prise de masse (+15%)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
                            </div>
                        </div>
                </div>

                {/* 4. PROTOCOLE */}
                <div className="pt-8 border-t border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Protocole cyclique</h3>
                            <p className="text-sm text-white/40">Répartition Low/High days</p>
                        </div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                            {showAdvanced ? 'Masquer options' : 'Options avancées'}
                        </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { id: '2/1', l: '2 Low / 1 High' },
                                { id: '3/1', l: '3 Low / 1 High' },
                                { id: '4/1', l: '4 Low / 1 High' },
                                { id: '5/2', l: '5 Low / 2 High' },
                            ].map(p => (
                                <button 
                                key={p.id}
                                onClick={() => setProtocol(p.id as Protocol)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all h-24 ${protocol === p.id ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}
                                >
                                    <span className="text-lg font-bold">{p.id}</span>
                                    <span className="text-[10px] font-medium">{p.l}</span>
                                </button>
                            ))}
                        </div>
                        
                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Phase training</label>
                                    <div className="relative">
                                        <select value={phase} onChange={(e) => setPhase(e.target.value as Phase)} className="w-full appearance-none bg-[#252525] border border-white/5 rounded-xl px-3 py-3 text-sm font-medium text-white outline-none focus:border-white/30">
                                            <option value="hypertrophie">Hypertrophie</option>
                                            <option value="force">Force</option>
                                            <option value="endurance">Endurance</option>
                                            <option value="cut">Sèche finale</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[13px] font-medium text-white/60">Sensibilité insuline (estimée)</label>
                                    <div className="relative">
                                        <select value={insulin} onChange={(e) => setInsulin(e.target.value as Insulin)} className="w-full appearance-none bg-[#252525] border border-white/5 rounded-xl px-3 py-3 text-sm font-medium text-white outline-none focus:border-white/30">
                                            <option value="normale">Normale</option>
                                            <option value="elevee">Élevée</option>
                                            <option value="reduite">Réduite</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
                
                <button 
                    onClick={calculateCycle}
                    disabled={!weight || !height || !age}
                    className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Générer le protocole
                </button>

            </div>

            {/* RÉSULTATS */}
            <div ref={resultsRef}>
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16 max-w-3xl mx-auto">
                    
                    {result.warnings.length > 0 && (
                        <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                            {result.warnings.map((w, i) => (
                                <div key={i} className="text-sm text-white/90 font-medium">
                                    • {w}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#252525] p-6 rounded-xl border border-white/5 text-center">
                            <div className="text-[11px] font-medium text-white/40 mb-2">Maintenance (TDEE)</div>
                            <div className="text-2xl md:text-3xl font-bold text-white/60">{result.tdee} <span className="text-sm">kcal</span></div>
                        </div>
                        <div className="bg-[#404040] p-6 rounded-xl border border-white/20 text-center relative overflow-hidden">
                            <div className="text-[11px] font-medium text-white/90 mb-2">Objectif cycle</div>
                            <div className="text-2xl md:text-3xl font-bold text-white">{result.targetTdee} <span className="text-sm">kcal</span></div>
                            <div className="text-[10px] font-medium mt-1 text-white/50 bg-black/20 inline-block px-2 py-0.5 rounded-full">
                                {result.deficit > 0 ? '+' : ''}{result.deficit} kcal/j
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#252525] border border-white/5 p-6 md:p-8 rounded-[24px]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-bold text-white">Jour bas (Low)</h4>
                                    <p className="text-xs font-medium text-white/40">{result.days.low} Jours • Repos/Cardio</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">{result.low.kcal}</div>
                                    <div className="text-[10px] font-medium text-white/40">kcal</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 bg-[#303030] rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/40 mb-1">Protéines</div>
                                    <div className="text-lg font-bold text-white">{result.low.p}g</div>
                                </div>
                                <div className="p-4 bg-[#303030] rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/40 mb-1">Lipides</div>
                                    <div className="text-lg font-bold text-white">{result.low.f}g</div>
                                </div>
                                <div className="p-4 bg-[#303030] border border-white/10 rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/40 mb-1">Glucides</div>
                                    <div className="text-lg font-bold text-white">{result.low.c}g</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#404040] p-6 md:p-8 rounded-[24px] text-white border border-white/10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-lg font-bold text-white">Jour haut (High)</h4>
                                    <p className="text-xs font-medium text-white/60">{result.days.high} Jours • Training intense</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">{result.high.kcal}</div>
                                    <div className="text-[10px] font-medium text-white/60">kcal</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 bg-white/10 rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/60 mb-1">Protéines</div>
                                    <div className="text-lg font-bold text-white">{result.high.p}g</div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/60 mb-1">Lipides</div>
                                    <div className="text-lg font-bold text-white">{result.high.f}g</div>
                                </div>
                                <div className="p-4 bg-white/20 border border-white/10 rounded-xl text-center">
                                    <div className="text-[10px] font-medium text-white/60 mb-1">Glucides</div>
                                    <div className="text-lg font-bold text-white">{result.high.c}g</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-[#252525] rounded-xl border border-white/5">
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            Note : Placez vos séances les plus volumineuses (Jambes, Dos) lors des <strong>Jours hauts</strong> pour maximiser l'utilisation du glycogène.
                        </p>
                    </div>

                    {/* BOUTON COPIER REMPLACÉ ICI */}
                    <button 
                        onClick={handleCopy}
                        className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copié !' : 'Copier mon protocole'}
                    </button>

                </div>
            )}
            </div>

            {/* FAQ SEO-OPTIMIZED */}
            <div className="mt-24 max-w-3xl mx-auto pb-24">
                <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes sur le carb cycling</h2>
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