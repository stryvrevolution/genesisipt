'use client';

import { useState, useRef } from 'react';
import { Moon, ChevronDown, Activity, BatteryLow, Zap, Battery, Copy, Check } from 'lucide-react';
import GenesisAssistant from '@/components/GenesisAssistant';

// ================================
// TYPES
// ================================

type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
type InputMode = 'day' | 'date';

interface PhaseConfig {
  id: Phase;
  name: string;
  dayRange: [number, number];
  color: {
    gradient: string;
    border: string;
  };
  icon: typeof Moon;
  hormones: {
    estrogen: number;
    progesterone: number;
    testosterone: number;
  };
  energy: number;
  strength: number;
  recovery: number;
  insulinSensitivity: number;
  metabolism: number;
}

interface TrainingRecommendation {
  volumeModifier: number;
  intensityRange: string;
  focus: string[];
  avoidance: string[];
  recoveryDays: string;
}

interface NutritionRecommendation {
  caloriesModifier: number;
  carbsModifier: number;
  proteinStable: boolean;
  fatsModifier: number;
  hydrationModifier: number;
  supplements: string[];
}

// ================================
// PHASE CONFIGURATIONS
// ================================

const PHASE_CONFIGS: Record<Phase, PhaseConfig> = {
  menstrual: {
    id: 'menstrual',
    name: 'Menstruation',
    dayRange: [1, 5],
    color: {
      gradient: 'from-red-50 to-red-100/50',
      border: 'border-red-200/50'
    },
    icon: BatteryLow,
    hormones: { estrogen: 2, progesterone: 1, testosterone: 2 },
    energy: 3,
    strength: 4,
    recovery: 3,
    insulinSensitivity: 6,
    metabolism: 1.0
  },
  follicular: {
    id: 'follicular',
    name: 'Phase Folliculaire',
    dayRange: [6, 13],
    color: {
      gradient: 'from-emerald-50 to-emerald-100/50',
      border: 'border-emerald-200/50'
    },
    icon: Zap,
    hormones: { estrogen: 8, progesterone: 2, testosterone: 5 },
    energy: 9,
    strength: 9,
    recovery: 9,
    insulinSensitivity: 9,
    metabolism: 1.0
  },
  ovulatory: {
    id: 'ovulatory',
    name: 'Ovulation',
    dayRange: [14, 15],
    color: {
      gradient: 'from-yellow-50 to-yellow-100/50',
      border: 'border-yellow-200/50'
    },
    icon: Activity,
    hormones: { estrogen: 10, progesterone: 3, testosterone: 7 },
    energy: 10,
    strength: 10,
    recovery: 8,
    insulinSensitivity: 9,
    metabolism: 1.02
  },
  luteal: {
    id: 'luteal',
    name: 'Phase Lutéale',
    dayRange: [16, 28],
    color: {
      gradient: 'from-orange-50 to-orange-100/50',
      border: 'border-orange-200/50'
    },
    icon: Battery,
    hormones: { estrogen: 5, progesterone: 8, testosterone: 3 },
    energy: 6,
    strength: 7,
    recovery: 5,
    insulinSensitivity: 5,
    metabolism: 1.08
  }
};

const TRAINING_PROTOCOLS: Record<Phase, TrainingRecommendation> = {
  menstrual: {
    volumeModifier: 0.6,
    intensityRange: '50-65% 1RM',
    focus: ['Cardio léger', 'Mobilité', 'Yoga', 'Stretching'],
    avoidance: ['Charges lourdes', 'HIIT intense', 'Volume élevé'],
    recoveryDays: '48-72h entre séances'
  },
  follicular: {
    volumeModifier: 1.3,
    intensityRange: '80-95% 1RM',
    focus: ['Force maximale', 'Hypertrophie', 'Charges lourdes', 'Composés'],
    avoidance: ['Aucune restriction majeure'],
    recoveryDays: '48-72h (récupération rapide)'
  },
  ovulatory: {
    volumeModifier: 1.2,
    intensityRange: '85-100% 1RM',
    focus: ['Tests 1RM', 'PRs', 'Explosivité', 'Plyométrie'],
    avoidance: ['Sur-entraînement'],
    recoveryDays: '48-96h (pic puis descente)'
  },
  luteal: {
    volumeModifier: 0.8,
    intensityRange: '65-80% 1RM',
    focus: ['Hypertrophie modérée', 'Technique', 'Cardio steady-state'],
    avoidance: ['Charges max', 'Volume excessif', 'Déficit agressif'],
    recoveryDays: '72-96h (récupération ralentie)'
  }
};

const NUTRITION_PROTOCOLS: Record<Phase, NutritionRecommendation> = {
  menstrual: {
    caloriesModifier: 1.0,
    carbsModifier: 1.0,
    proteinStable: true,
    fatsModifier: 1.0,
    hydrationModifier: 1.15,
    supplements: ['Fer (18-25mg)', 'Vitamine C', 'Magnésium (300-400mg)', 'Oméga-3 (2g EPA/DHA)']
  },
  follicular: {
    caloriesModifier: 0.95,
    carbsModifier: 1.35,
    proteinStable: true,
    fatsModifier: 0.9,
    hydrationModifier: 1.0,
    supplements: ['Créatine (5g)', 'Vitamine D3 (2000-4000 UI)']
  },
  ovulatory: {
    caloriesModifier: 1.0,
    carbsModifier: 1.4,
    proteinStable: true,
    fatsModifier: 0.9,
    hydrationModifier: 1.1,
    supplements: ['Créatine (5g)', 'Bêta-alanine (3-5g)', 'Caféine pré-workout (200-300mg)']
  },
  luteal: {
    caloriesModifier: 1.08,
    carbsModifier: 0.75,
    proteinStable: true,
    fatsModifier: 1.2,
    hydrationModifier: 1.2,
    supplements: ['Magnésium (400-600mg)', 'Vitamine B6 (50-100mg)', 'Inositol (2-4g)']
  }
};

// ================================
// HELPER FUNCTIONS
// ================================

const calculateCurrentPhase = (dayOfCycle: number, cycleLength: number): Phase => {
  if (dayOfCycle >= 1 && dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle >= 6 && dayOfCycle <= Math.floor(cycleLength / 2) - 1) return 'follicular';
  if (dayOfCycle >= Math.floor(cycleLength / 2) && dayOfCycle <= Math.floor(cycleLength / 2) + 1) return 'ovulatory';
  return 'luteal';
};

const getDaysUntilNextPhase = (currentDay: number, currentPhase: Phase, cycleLength: number): number => {
  const phaseOrder: Phase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
  const currentIndex = phaseOrder.indexOf(currentPhase);
  const nextPhase = phaseOrder[(currentIndex + 1) % 4];
  const nextPhaseStart = PHASE_CONFIGS[nextPhase].dayRange[0];
  
  if (nextPhaseStart > currentDay) {
    return nextPhaseStart - currentDay;
  } else {
    return (cycleLength - currentDay) + nextPhaseStart;
  }
};

const calculateDayOfCycle = (lastPeriodDate: Date, cycleLength: number): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dayOfCycle = (diffDays % cycleLength) || cycleLength;
  return dayOfCycle;
};

// ================================
// MAIN COMPONENT
// ================================

export default function CycleSyncCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>('day');
  const [baseCal, setBaseCal] = useState('');
  const [baseProtein, setBaseProtein] = useState('');
  const [baseCarbs, setBaseCarbs] = useState('');
  const [baseFats, setBaseFats] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [currentDay, setCurrentDay] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<{
    dayOfCycle: number;
    phase: Phase;
    phaseConfig: PhaseConfig;
    training: TrainingRecommendation;
    nutrition: NutritionRecommendation;
    adjustedCal: number;
    adjustedProtein: number;
    adjustedCarbs: number;
    adjustedFats: number;
    daysUntilNext: number;
    warnings: string[];
  } | null>(null);

  const calculatePhase = () => {
    setCopied(false);
    const cal = parseFloat(baseCal);
    const protein = parseFloat(baseProtein);
    const carbs = parseFloat(baseCarbs);
    const fats = parseFloat(baseFats);
    const length = parseInt(cycleLength);

    if (!cal || !protein || !carbs || !fats || !length) return;

    let day: number;
    if (inputMode === 'day') {
      day = parseInt(currentDay);
      if (!day) return;
    } else {
      if (!lastPeriodDate) return;
      const periodDate = new Date(lastPeriodDate);
      day = calculateDayOfCycle(periodDate, length);
    }

    const warnings: string[] = [];

    if (length < 21 || length > 35) {
      warnings.push('Cycle atypique (<21j ou >35j) : Consulter gynécologue. SOPK, thyroïde, stress chronique possible.');
    }
    if (day > length) {
      warnings.push('Jour cycle > durée cycle : Vérifier données. Jour 1 = premier jour menstruation.');
    }
    if (cal < 1200) {
      warnings.push('CRITIQUE: Calories <1200 kcal. Risque MAJEUR aménorrhée hypothalamique. Augmenter immédiatement.');
    }

    const phase = calculateCurrentPhase(day, length);
    const phaseConfig = PHASE_CONFIGS[phase];
    const training = TRAINING_PROTOCOLS[phase];
    const nutrition = NUTRITION_PROTOCOLS[phase];

    const adjustedProtein = protein;
    const adjustedCarbs = Math.round(carbs * nutrition.carbsModifier);
    const adjustedFats = Math.round(fats * nutrition.fatsModifier);
    const adjustedCal = Math.round((adjustedProtein * 4) + (adjustedCarbs * 4) + (adjustedFats * 9));

    const daysUntilNext = getDaysUntilNextPhase(day, phase, length);

    if (phase === 'follicular') warnings.push('FENÊTRE ANABOLIQUE : Œstrogène peak. Maximiser volume/charges. Sensibilité insuline +40% = glucides élevés tolérés (Davidsen 2007).');
    if (phase === 'ovulatory') {
      warnings.push('PIC FORCE 24-48H : Tests 1RM, PRs optimaux. Testostérone relative maximale (Janse de Jonge 2003).');
      warnings.push('Laxité ligamentaire accrue (œstrogène) : Échauffement prolongé 15-20min obligatoire. Prévention blessures.');
    }
    if (phase === 'luteal') {
      warnings.push(`Métabolisme +${((phaseConfig.metabolism - 1) * 100).toFixed(0)}% (progestérone thermogénique) : Calories augmentées = NÉCESSAIRE pour homéostasie hormonale (Oosthuyse 2010).`);
      warnings.push('SPM J21-28 possible : Fringales glucides normales (baisse sérotonine). Satisfaire modérément vs restriction rigide.');
    }
    if (phase === 'menstrual') {
      warnings.push('Anémie ferriprive risque : Perte sang 30-50mg fer. Suppléments fer (18-25mg/j) + Vitamine C (absorption).');
      warnings.push('J1-2 repos complet acceptable si dysménorrhée sévère. Crampes : Chaleur locale, magnésium 400mg/j.');
    }

    const phaseOrder: Phase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    const nextPhaseName = PHASE_CONFIGS[phaseOrder[(phaseOrder.indexOf(phase) + 1) % 4]].name;
    warnings.push(`Phase suivante (${nextPhaseName}) dans ${daysUntilNext} jours.`);

    setResult({
      dayOfCycle: day,
      phase,
      phaseConfig,
      training,
      nutrition,
      adjustedCal,
      adjustedProtein,
      adjustedCarbs,
      adjustedFats,
      daysUntilNext,
      warnings
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopy = () => {
    if (!result) return;
    const url = 'https://www.stryvlab.com/outils/cycle-sync';
    const textToCopy = `Bilan Cycle Sync - STRYV LAB

• Phase : ${result.phaseConfig.name} (J${result.dayOfCycle}/${cycleLength})
• Prochaine phase : dans ${result.daysUntilNext} jours

Nutrition ajustée (Hormonal Match) :
• Calories : ${result.adjustedCal} kcal
• Protéines : ${result.adjustedProtein}g
• Glucides : ${result.adjustedCarbs}g
• Lipides : ${result.adjustedFats}g

Training Focus : ${result.training.intensityRange}
${result.training.focus[0]} • ${result.training.focus[1]}

Retrouvez cet outil ici : ${url}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      question: "Quel est le workflow complet pour utiliser Cycle Sync correctement ?",
      answer: "Cycle Sync nécessite 2 étapes préalables pour fonctionner optimalement. ÉTAPE 1 - BODY FAT CALCULATOR : Calculez votre pourcentage de masse grasse. ÉTAPE 2 - MACRO CALCULATOR : Calculez vos besoins caloriques & macros baseline. ÉTAPE 3 - CYCLE SYNC : Entrez ces valeurs ici avec les infos de votre cycle."
    },
    {
      question: "Pourquoi synchroniser training/nutrition avec le cycle menstruel ?",
      answer: "Les oscillations hormonales (28j) impactent le métabolisme. Phase folliculaire (J6-14) : Anabolisme peak, sensibilité insuline élevée. Phase lutéale (J16-28) : Métabolisme basal +5-10%, récupération ralentie. Ignorer ces phases mène à la sous-performance."
    },
    {
        question: "Comment ajuster concrètement volume/intensité training selon phases ?",
        answer: "MENSTRUATION (J1-5) : Volume -40%, Intensité 50-65% (Récup active). FOLLICULAIRE (J6-13) : Volume +30%, Intensité 80-95% (Force/Hypertrophie). OVULATION (J14-15) : Volume +20%, Intensité 100% (PRs, Explosivité). LUTÉALE (J16-28) : Volume -20%, Intensité 65-80% (Technique, Cardio)."
    },
    {
        question: "Pourquoi augmenter calories phase lutéale malgré baisse performance ?",
        answer: "La progestérone est thermogénique (+150-300 kcal/j de dépense au repos). Ne pas augmenter les calories crée un déficit trop grand qui stresse l'organisme (Cortisol) et peut mener à l'aménorrhée."
    },
    {
        question: "Gestion irrégularités : SOPK, aménorrhée, cycles courts/longs ?",
        answer: "SOPK : Focus glucides stables et training résistance. Aménorrhée : Arrêt du déficit calorique impératif. Cycles irréguliers : Consultez un gynécologue avant d'utiliser cet outil."
    }
  ];

  const phaseOrder: Phase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

  return (
    <div className="w-full space-y-12">
      <div className="border-b border-white/10 pb-6">
          <h3 className="text-lg font-bold text-white mb-1">Synchronisation cycle menstruel</h3>
          <p className="text-sm text-white/40 font-medium">Ajustements training/nutrition selon phase hormonale</p>
      </div>

      <div className="space-y-8">
          <div className="bg-[#404040] border border-white/10 rounded-xl p-5">
              <div className="text-sm text-white/90 font-medium mb-2">Workflow recommandé</div>
              <div className="text-xs text-white/60 space-y-1">
                  <p>1. Calculez votre <strong className="text-white/80">Body Fat%</strong> dans l'outil dédié</p>
                  <p>2. Calculez vos <strong className="text-white/80">besoins caloriques & macros baseline</strong> dans Macro Calculator</p>
                  <p>3. Entrez ces valeurs ci-dessous pour obtenir vos ajustements cycliques</p>
              </div>
          </div>

          <div>
              <h4 className="text-sm font-bold text-white mb-4 pb-2 border-b border-white/10">Nutrition Baseline (depuis Macro Calculator)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Calories (kcal/j)</label>
                      <input type="number" value={baseCal} onChange={(e) => setBaseCal(e.target.value)} placeholder="1800" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Protéines (g/j)</label>
                      <input type="number" value={baseProtein} onChange={(e) => setBaseProtein(e.target.value)} placeholder="120" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Glucides (g/j)</label>
                      <input type="number" value={baseCarbs} onChange={(e) => setBaseCarbs(e.target.value)} placeholder="200" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Lipides (g/j)</label>
                      <input type="number" value={baseFats} onChange={(e) => setBaseFats(e.target.value)} placeholder="50" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                  </div>
              </div>
          </div>

          <div className="pt-8 border-t border-white/5">
              <h4 className="text-sm font-bold text-white mb-4 pb-2 border-b border-white/10">Informations cycle menstruel</h4>
              <div className="space-y-6">
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Durée totale du cycle (jours)</label>
                      <input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="28" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                      <p className="text-[11px] text-white/40">Moyenne 28j (normal: 21-35j)</p>
                  </div>
                  <div className="space-y-3">
                      <label className="text-[13px] font-medium text-white/60">Comment souhaitez-vous indiquer le jour actuel ?</label>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setInputMode('day')} className={`p-4 rounded-xl border flex flex-col gap-1 transition-all ${inputMode === 'day' ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}>
                              <span className="text-sm font-bold">Je connais mon jour</span>
                              <span className="text-[10px] text-white/40">Saisie directe (ex: Jour 14)</span>
                          </button>
                          <button onClick={() => setInputMode('date')} className={`p-4 rounded-xl border flex flex-col gap-1 transition-all ${inputMode === 'date' ? 'border-white/40 bg-[#404040] text-white' : 'border-white/5 bg-[#252525] text-white/40 hover:border-white/20'}`}>
                              <span className="text-sm font-bold">Date dernières règles</span>
                              <span className="text-[10px] text-white/40">Calcul automatique</span>
                          </button>
                      </div>
                  </div>
                  {inputMode === 'day' ? (
                      <div className="space-y-3 animate-in fade-in">
                          <label className="text-[13px] font-medium text-white/60">Jour actuel du cycle</label>
                          <input type="number" value={currentDay} onChange={(e) => setCurrentDay(e.target.value)} placeholder="14" className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white placeholder-white/10 outline-none focus:border-white/30 transition-all" />
                          <p className="text-[11px] text-white/40">Jour 1 = Premier jour menstruation (saignement)</p>
                      </div>
                  ) : (
                      <div className="space-y-3 animate-in fade-in">
                          <label className="text-[13px] font-medium text-white/60">Date premier jour dernières règles</label>
                          <input type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-xl px-4 py-4 text-lg font-medium text-white outline-none focus:border-white/30 transition-all" />
                          <p className="text-[11px] text-white/40">Calcul automatique du jour cycle selon date actuelle</p>
                      </div>
                  )}
              </div>
          </div>

          <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h4 className="text-sm font-bold text-white mb-1">Aperçu 4 phases</h4>
                      <p className="text-xs text-white/40">Fluctuations hormonales</p>
                  </div>
                  <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium text-white/40 hover:text-white underline-offset-2 hover:underline">
                      {showAdvanced ? 'Masquer' : 'Voir détails'}
                  </button>
              </div>
              {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                      {phaseOrder.map(phaseId => {
                        const p = PHASE_CONFIGS[phaseId];
                        const Icon = p.icon;
                        return (
                          <div key={phaseId} className={`bg-gradient-to-br ${p.color.gradient} border ${p.color.border} p-5 rounded-xl`}>
                              <div className="flex items-center gap-3 mb-3">
                                  <Icon className="w-6 h-6 text-[#1A1A1A]" />
                                  <div>
                                      <div className="font-bold text-sm text-[#1A1A1A]">{p.name}</div>
                                      <div className="text-[10px] text-[#1A1A1A]/60">J{p.dayRange[0]}-{p.dayRange[1]}</div>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#1A1A1A]/70">
                                  <div>Énergie: {p.energy}/10</div>
                                  <div>Force: {p.strength}/10</div>
                                  <div>Récup: {p.recovery}/10</div>
                                  <div>Insuline: {p.insulinSensitivity}/10</div>
                              </div>
                          </div>
                        );
                      })}
                  </div>
              )}
          </div>
      </div>

      <button onClick={calculatePhase} disabled={!baseCal || !baseProtein || !baseCarbs || !baseFats || !cycleLength || (inputMode === 'day' ? !currentDay : !lastPeriodDate)} className="w-full py-5 bg-white hover:bg-gray-200 text-[#1A1A1A] rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
          Analyser & Générer protocole
      </button>

      <div ref={resultsRef}>
      {result && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 space-y-6 mt-16">
              {result.warnings.length > 0 && (
                  <div className="bg-[#404040] border border-white/10 rounded-xl p-5 space-y-2">
                      {result.warnings.map((w, i) => <div key={i} className="text-sm text-white/90 font-medium">{w}</div>)}
                  </div>
              )}

              <div className={`bg-gradient-to-br ${result.phaseConfig.color.gradient} border ${result.phaseConfig.color.border} p-8 rounded-2xl`}>
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="text-3xl font-bold text-[#1A1A1A] mb-2">{result.phaseConfig.name}</h3>
                          <p className="text-sm text-[#1A1A1A]/60">Jour {result.dayOfCycle} / {cycleLength}</p>
                      </div>
                      <div className="text-right">
                          <div className="text-xs text-[#1A1A1A]/60 mb-2">Prochaine phase</div>
                          <div className="text-4xl font-bold text-[#1A1A1A]">{result.daysUntilNext}j</div>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: 'Énergie', value: result.phaseConfig.energy },
                        { label: 'Force', value: result.phaseConfig.strength },
                        { label: 'Récupération', value: result.phaseConfig.recovery },
                        { label: 'Sensibilité Insuline', value: result.phaseConfig.insulinSensitivity }
                      ].map(metric => (
                        <div key={metric.label} className="bg-white/40 rounded-lg p-3 text-center">
                            <div className="text-[10px] text-[#1A1A1A]/60 uppercase mb-1">{metric.label}</div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">{metric.value}<span className="text-sm">/10</span></div>
                        </div>
                      ))}
                  </div>
                  <div className="border-t border-[#1A1A1A]/10 pt-4">
                      <div className="text-xs text-[#1A1A1A]/60 mb-2">Hormones Dominantes</div>
                      <div className="flex gap-4 text-sm text-[#1A1A1A]">
                          <span>Œstrogène: {result.phaseConfig.hormones.estrogen}/10</span>
                          <span>Progestérone: {result.phaseConfig.hormones.progesterone}/10</span>
                          <span>Testostérone: {result.phaseConfig.hormones.testosterone}/10</span>
                      </div>
                  </div>
              </div>

              <div className="pt-8">
                  <h3 className="text-lg font-bold text-white mb-6">Nutrition ajustée phase actuelle</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#252525] p-5 rounded-xl border border-white/5">
                          <div className="text-[11px] text-white/40 mb-2">Calories</div>
                          <div className="text-3xl font-bold text-white">{result.adjustedCal}</div>
                          <div className="text-xs text-white/50 mt-1">{((result.adjustedCal / parseFloat(baseCal) - 1) * 100).toFixed(0)}%</div>
                      </div>
                      <div className="bg-[#252525] p-5 rounded-xl border border-white/5">
                          <div className="text-[11px] text-white/40 mb-2">Protéines</div>
                          <div className="text-3xl font-bold text-white">{result.adjustedProtein}g</div>
                          <div className="text-xs text-white/50 mt-1">Stables</div>
                      </div>
                      <div className="bg-[#252525] p-5 rounded-xl border border-white/5">
                          <div className="text-[11px] text-white/40 mb-2">Glucides</div>
                          <div className="text-3xl font-bold text-white">{result.adjustedCarbs}g</div>
                          <div className="text-xs text-white/50 mt-1">{result.nutrition.carbsModifier > 1 ? '+' : ''}{((result.nutrition.carbsModifier - 1) * 100).toFixed(0)}%</div>
                      </div>
                      <div className="bg-[#252525] p-5 rounded-xl border border-white/5">
                          <div className="text-[11px] text-white/40 mb-2">Lipides</div>
                          <div className="text-3xl font-bold text-white">{result.adjustedFats}g</div>
                          <div className="text-xs text-white/50 mt-1">{result.nutrition.fatsModifier > 1 ? '+' : ''}{((result.nutrition.fatsModifier - 1) * 100).toFixed(0)}%</div>
                      </div>
                  </div>
                  <div className="bg-[#252525] border border-white/5 rounded-xl p-5 mt-4">
                      <div className="text-sm font-bold text-white mb-3">Suppléments recommandés phase {result.phaseConfig.name}</div>
                      <div className="flex flex-wrap gap-2">
                          {result.nutrition.supplements.map((supp, i) => (
                              <span key={i} className="text-xs bg-[#404040] text-white/80 px-3 py-1 rounded-lg border border-white/5">
                                  {supp}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="pt-8">
                  <h3 className="text-lg font-bold text-white mb-6">Protocole training phase actuelle</h3>
                  <div className="space-y-3">
                      <div className="bg-[#252525] border border-white/5 rounded-xl p-5">
                          <div className="flex justify-between items-center mb-3">
                              <div className="text-sm font-bold text-white">Volume Training</div>
                              <div className="text-2xl font-bold text-white">{(result.training.volumeModifier * 100).toFixed(0)}%</div>
                          </div>
                          <div className="text-xs text-white/60">Baseline × {result.training.volumeModifier.toFixed(1)}</div>
                      </div>
                      <div className="bg-[#252525] border border-white/5 rounded-xl p-5">
                          <div className="text-sm font-bold text-white mb-3">Intensité recommandée</div>
                          <div className="text-lg text-white/80">{result.training.intensityRange}</div>
                      </div>
                      <div className="bg-[#252525] border border-white/5 rounded-xl p-5">
                          <div className="text-sm font-bold text-white mb-3">Focus entraînement</div>
                          <div className="flex flex-wrap gap-2">
                              {result.training.focus.map((item, i) => <span key={i} className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30">{item}</span>)}
                          </div>
                      </div>
                      <div className="bg-[#252525] border border-white/5 rounded-xl p-5">
                          <div className="text-sm font-bold text-white mb-3">À éviter</div>
                          <div className="flex flex-wrap gap-2">
                              {result.training.avoidance.map((item, i) => <span key={i} className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-lg border border-red-500/30">{item}</span>)}
                          </div>
                      </div>
                      <div className="bg-[#252525] border border-white/5 rounded-xl p-5">
                          <div className="text-sm font-bold text-white mb-2">Récupération</div>
                          <div className="text-sm text-white/80">{result.training.recoveryDays}</div>
                      </div>
                  </div>
              </div>

              <button onClick={handleCopy} className={`w-full py-5 border-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié !' : 'Copier mon bilan hormonal'}
              </button>

              <div className="p-5 bg-[#252525] rounded-xl border border-white/5 mt-4">
                  <p className="text-sm text-white/60 leading-relaxed font-medium">
                      <strong className="text-white/90">Méthodologie :</strong> Phase {result.phaseConfig.name} (J{result.phaseConfig.dayRange[0]}-{result.phaseConfig.dayRange[1]}). Ajustements basés Davidsen (2007), Oosthuyse & Bosch (2010).
                  </p>
              </div>
          </div>
      )}
      </div>

      <div className="mt-24 pb-24">
          <h2 className="text-lg font-bold text-white mb-6">Questions fréquentes sur cycle sync</h2>
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
    </div>
  );
}