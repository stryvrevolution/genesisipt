import { CYCLE_PHASES } from './cyclePhases';

/**
 * Dictionnaire de traductions - Version française uniquement
 */
const TRANSLATIONS = {
  phases: {
    menstrual: { name: 'Menstruelle', desc: 'Phase menstruation', hormones: 'Œstrogène ↓↓ · Progestérone ↓↓' },
    follicular: { name: 'Folliculaire', desc: 'Phase anabolique optimale', hormones: 'Œstrogène ⬆️⬆️ · Progestérone ↓' },
    ovulatory: { name: 'Ovulatoire', desc: 'Pic de force', hormones: 'Œstrogène ⬆️⬆️⬆️ · LH Surge' },
    luteal_early: { name: 'Lutéale Précoce', desc: 'Métabolisme accru', hormones: 'Progestérone ⬆️ · Œstrogène ↓' },
    luteal_late: { name: 'Lutéale Tardive', desc: 'Phase PMS', hormones: 'Progestérone ⬇️ · Œstrogène ⬇️' }
  },
  training: {
    menstrual: [
      '✓ Volume réduit: -20% vs baseline',
      '✓ Intensité modérée: 60-70% 1RM',
      '✓ Focus: Mobilité, technique, récupération active',
      '⚠️ Éviter: HIIT intense, tests 1RM'
    ],
    follicular: [
      '✅ Volume MAX: +20-30% vs baseline',
      '✅ Progressions lourdes: 80-90% 1RM optimales',
      '✅ HIIT: Récupération rapide, tolérance élevée',
      '✅ Hypertrophie: Fenêtre anabolique au pic',
      '💪 Période idéale pour PRs et progressions'
    ],
    ovulatory: [
      '🔥 FORCE MAXIMALE: Tests 1RM optimaux',
      '✅ Intensité très élevée: 85-95% 1RM',
      '✅ Volume modéré-élevé',
      '⚠️ Température corporelle +0.5°C: Hydratation ++'
    ],
    luteal_early: [
      '✓ Intensité > Volume',
      '✓ Training force relative: Clusters, rest-pause',
      '✓ Volume réduit: -10% vs baseline',
      '⚠️ Récupération rallongée: Repos 3-4min'
    ],
    luteal_late: [
      '⚠️ Volume réduit: -30% (Deload week)',
      '✓ Intensité modérée: 60-75% 1RM',
      '✓ Focus: Marche, yoga, mobilité',
      '⚠️ Fatigue accrue: Priorité récupération',
      '💡 Semaine idéale pour deload programmé'
    ]
  },
  warnings: {
    waterRetention: '⚠️ Rétention d\'eau probable: +1-3kg. Ne pas se peser cette semaine.',
    increasedAppetite: 'ℹ️ Appétit accru normal (progestérone). Calories augmentées pour compenser métabolisme.',
    deficitReduced: '💡 Déficit réduit cette semaine. Phase folliculaire = meilleure fenêtre fat loss.',
    insulinHigh: '💡 Sensibilité insuline au pic: Glucides peuvent être augmentés (+20-30%) sans impact négatif.',
    insulinLow: '⚠️ Sensibilité insuline réduite: Glucides élevés moins optimaux. Favoriser lipides.',
    cutFirst: '⚠️ BF% élevé: Cut recommandé avant surplus pour optimiser partition nutriments.'
  }
};

/**
 * Calcule nutrition et training optimisés selon phase menstruelle
 */
export function calculateCycleOptimizedNutrition(data) {
  const {
    weight, height, age, bodyFat,
    cycleDay, cycleLength,
    steps, workouts, goal
  } = data;

  // Parse numbers
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);
  const bf = bodyFat ? parseFloat(bodyFat) : null;
  const cd = parseInt(cycleDay);
  const cl = parseInt(cycleLength);
  const dailySteps = parseFloat(steps) || 0;
  const weeklyWorkouts = parseFloat(workouts) || 0;

  // ========================================
  // 1. DÉTERMINER PHASE ACTUELLE
  // ========================================
  const currentPhase = determineCyclePhase(cd, cl);

  // ========================================
  // 2. CALCULER BASELINE (MÊME LOGIQUE MACROS CALC)
  // ========================================
  
  // LBM (Boer Formula - Femmes)
  let leanMass;
  let estimatedBF;
  
  if (bf && bf > 0) {
    estimatedBF = bf;
    leanMass = w * (1 - estimatedBF / 100);
  } else {
    leanMass = (0.252 * w) + (0.473 * h) - 48.3;
    leanMass = Math.max(w * 0.5, Math.min(w, leanMass));
    estimatedBF = ((w - leanMass) / w) * 100;
  }

  // BMR (Katch-McArdle)
  let bmr = 370 + (21.6 * leanMass);
  if (a > 30) {
    const ageDecrement = Math.floor((a - 30) / 10) * 0.02;
    bmr = bmr * (1 - ageDecrement);
  }

  // NEAT + EAT + TEF
  const neat = dailySteps * 0.04;
  const trainingLoad = { 0: 0, 1: 200, 2: 250, 3: 325, 4: 400, 5: 475, 6: 550, 7: 625 };
  const eatPerDay = trainingLoad[Math.min(Math.floor(weeklyWorkouts), 7)] || 325;
  const tef = bmr * 0.1;

  // ========================================
  // 3. AJUSTEMENT BMR SELON PHASE
  // ========================================
  const phaseData = CYCLE_PHASES[currentPhase.id];
  const adjustedBMR = bmr * phaseData.bmrMultiplier;
  
  const baselineTDEE = Math.round(adjustedBMR + neat + eatPerDay + tef);

  // ========================================
  // 4. OBJECTIF CALORIQUE (PHASE-AWARE)
  // ========================================
  let targetCalories = baselineTDEE;
  let surplusOrDeficit = 0;

  if (goal === 'deficit') {
    let deficitFactor;
    if (currentPhase.id === 'follicular' || currentPhase.id === 'ovulatory') {
      deficitFactor = estimatedBF > 25 ? 0.22 : 0.18;
    } else {
      deficitFactor = estimatedBF > 25 ? 0.15 : 0.12;
    }
    surplusOrDeficit = -Math.round(baselineTDEE * deficitFactor);
    
  } else if (goal === 'surplus') {
    if (currentPhase.id === 'follicular' || currentPhase.id === 'ovulatory') {
      surplusOrDeficit = 200;
    } else {
      surplusOrDeficit = 100;
    }
  }

  targetCalories = baselineTDEE + surplusOrDeficit;

  // ========================================
  // 5. MACROS (PHASE-OPTIMIZED)
  // ========================================
  const proteinMultiplier = phaseData.proteinMultiplier;
  const protein = Math.round(leanMass * proteinMultiplier);

  const fatsMultiplier = phaseData.fatsMultiplier;
  const minFats = w * 0.9;
  const calculatedFats = w * fatsMultiplier;
  const fats = Math.round(Math.max(minFats, calculatedFats));

  const remainingCalories = targetCalories - (protein * 4) - (fats * 9);
  const carbs = Math.max(0, Math.round(remainingCalories / 4));

  // ========================================
  // 6. TRAINING RECOMMENDATIONS
  // ========================================
  const trainingRecs = getPhaseTrainingRecommendations(currentPhase.id);

  // ========================================
  // 7. INSIGHTS & WARNINGS
  // ========================================
  const insights = phaseData.insights || [];
  const warnings = generatePhaseWarnings(currentPhase.id, goal, estimatedBF, carbs, w);

  // ========================================
  // 8. JOURS AVANT PROCHAINE PHASE
  // ========================================
  const daysUntilNext = calculateDaysToNextPhase(cd, cl, currentPhase.id);

  // ========================================
  // 9. NOUVEAU: PERFORMANCE POTENTIAL
  // ========================================
  const performancePotential = phaseData.performancePotential;

  // ========================================
  // 10. NOUVEAU: PHASE FOCUS
  // ========================================
  const phaseFocus = phaseData.focusPriorities[goal] || [];

  return {
    currentPhase: {
      id: currentPhase.id,
      name: currentPhase.name,
      days: currentPhase.days,
      description: currentPhase.description,
      hormones: currentPhase.hormones
    },
    daysUntilNextPhase: daysUntilNext,
    nutrition: {
      calories: targetCalories,
      adjustment: surplusOrDeficit,
      macros: {
        p: protein,
        f: fats,
        c: carbs,
        ratios: {
          p: Math.round((protein / leanMass) * 10) / 10,
          f: Math.round((fats / w) * 10) / 10,
          c: Math.round((carbs / w) * 10) / 10
        }
      }
    },
    training: {
      recommendations: trainingRecs
    },
    insights: insights,
    warnings: warnings,
    
    // NOUVEAUX RETOURS
    performancePotential: performancePotential,
    phaseFocus: phaseFocus
  };
}

/**
 * Détermine la phase du cycle basée sur le jour actuel
 */
function determineCyclePhase(day, length) {
  const t = TRANSLATIONS.phases;

  if (day >= 1 && day <= 5) {
    return {
      id: 'menstrual',
      name: t.menstrual.name,
      days: 'J1-5',
      description: t.menstrual.desc,
      hormones: t.menstrual.hormones
    };
  }
  
  if (day >= 6 && day <= 14) {
    return {
      id: 'follicular',
      name: t.follicular.name,
      days: 'J6-14',
      description: t.follicular.desc,
      hormones: t.follicular.hormones
    };
  }
  
  if (day >= 15 && day <= 17) {
    return {
      id: 'ovulatory',
      name: t.ovulatory.name,
      days: 'J15-17',
      description: t.ovulatory.desc,
      hormones: t.ovulatory.hormones
    };
  }
  
  if (day >= 18 && day <= Math.min(23, length - 5)) {
    return {
      id: 'luteal_early',
      name: t.luteal_early.name,
      days: 'J18-23',
      description: t.luteal_early.desc,
      hormones: t.luteal_early.hormones
    };
  }
  
  return {
    id: 'luteal_late',
    name: t.luteal_late.name,
    days: `J${Math.max(24, length - 4)}-${length}`,
    description: t.luteal_late.desc,
    hormones: t.luteal_late.hormones
  };
}

/**
 * Calcule jours avant prochaine phase
 */
function calculateDaysToNextPhase(currentDay, cycleLength, phaseId) {
  const phaseEndDays = {
    menstrual: 5,
    follicular: 14,
    ovulatory: 17,
    luteal_early: 23,
    luteal_late: cycleLength
  };
  
  const endDay = phaseEndDays[phaseId];
  return endDay - currentDay + 1;
}

/**
 * Recommandations training par phase
 */
function getPhaseTrainingRecommendations(phaseId) {
  const recs = TRANSLATIONS.training;
  return recs[phaseId] || recs.menstrual;
}

/**
 * Génère warnings selon phase
 */
function generatePhaseWarnings(phaseId, goal, bf, carbs, weight) {
  const t = TRANSLATIONS.warnings;
  const warnings = [];

  if (phaseId === 'luteal_late') {
    warnings.push(t.waterRetention);
    warnings.push(t.increasedAppetite);
    
    if (goal === 'deficit') {
      warnings.push(t.deficitReduced);
    }
  }

  if (phaseId === 'follicular' && carbs < weight * 3) {
    warnings.push(t.insulinHigh);
  }

  if (phaseId === 'luteal_early' && carbs > weight * 3.5) {
    warnings.push(t.insulinLow);
  }

  if (goal === 'surplus' && bf > 28) {
    warnings.push(t.cutFirst);
  }

  return warnings;
}