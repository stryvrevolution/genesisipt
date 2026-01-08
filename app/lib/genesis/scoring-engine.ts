// lib/genesis/scoring-engine.ts
// v1 — moteur de scoring pur (sans logique business / recommandations)

export type IPTMode = 'ipt' | 'gplus' | 'omni';

export type AxisKey =
  | 'sleep'
  | 'nutrition'
  | 'stress'
  | 'training'
  | 'recovery'
  | 'adherence';

export type Severity = 'critical' | 'high' | 'moderate';

export interface AxisContribution {
  question_id: string;
  impact: number; // score 0..1 après mapping de la réponse
  weight: number; // poids structurel de la question dans l’axe
}

export interface AxisScore {
  name: AxisKey;
  raw_score: number; // somme des impacts pondérés
  normalized_score: number; // 0-100
  contributions: AxisContribution[];
}

export interface IPTScores {
  axes: Record<AxisKey, AxisScore>;
  ipt_global: number; // 0-100
}

export interface DerivedVariables {
  sleep_hours_avg: number;
  protein_g_per_kg: number;
  stress_score_proxy: number;
  training_load: number;
  recovery_proxy: number;
  metabolic_flex_proxy: number;
  adherence_proxy: number;
}

/**
 * Structure attendue des réponses.
 * - Clé = question_id
 * - Valeur = number | string | boolean | (string|number)[] selon tes composants
 */
export type Responses = Record<string, any>;

/**
 * Comment une question contribue à un axe.
 * - toImpact(): convertit la réponse brute en impact 0..1 (1 = optimal)
 * - weight: importance dans l’axe
 */
export interface QuestionAxisRule {
  axis: AxisKey;
  weight: number; // ex 0.5, 1, 1.5, 2
  toImpact: (answer: any, all: Responses) => number; // retourne 0..1
}

export interface QuestionConfig {
  id: string;
  rules: QuestionAxisRule[];
}

/* ---------------------------------------------
   Helpers (purs)
--------------------------------------------- */

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function toNumber(x: any): number {
  const n = typeof x === 'number' ? x : parseFloat(String(x));
  return Number.isFinite(n) ? n : 0;
}

function boolImpact(answer: any, trueIsGood = true): number {
  const v = !!answer;
  return clamp01(trueIsGood ? (v ? 1 : 0) : (v ? 0 : 1));
}

/**
 * Échelle simple 0..1 à partir d’un score 1..N (ex: 1-5)
 */
function likertImpact(answer: any, min = 1, max = 5, higherIsBetter = true) {
  const v = toNumber(answer);
  if (max <= min) return 0;
  const t = clamp01((v - min) / (max - min));
  return clamp01(higherIsBetter ? t : 1 - t);
}

/**
 * Convertit une valeur numérique en impact via une “zone optimale”.
 * - ex: sommeil 7..9h => 1, sinon décroît.
 */
function optimalBandImpact(
  value: number,
  optimalMin: number,
  optimalMax: number,
  hardMin: number,
  hardMax: number
) {
  if (!Number.isFinite(value)) return 0;
  if (value <= hardMin || value >= hardMax) return 0;

  if (value >= optimalMin && value <= optimalMax) return 1;

  // décroissance linéaire vers les bords
  if (value < optimalMin) {
    const t = (value - hardMin) / (optimalMin - hardMin);
    return clamp01(t);
  }
  const t = (hardMax - value) / (hardMax - optimalMax);
  return clamp01(t);
}

/* ---------------------------------------------
   Config v1 (minimal, extensible)
   Remplace / enrichis avec tes vrais question_id.
--------------------------------------------- */

export const QUESTIONS_CONFIG_V1: QuestionConfig[] = [
  // sleep
  {
    id: 'sleep_hours_avg',
    rules: [
      {
        axis: 'sleep',
        weight: 2,
        toImpact: (a) =>
          optimalBandImpact(toNumber(a), 7, 9, 3, 12), // 7-9h optimal
      },
      {
        axis: 'recovery',
        weight: 1,
        toImpact: (a) =>
          optimalBandImpact(toNumber(a), 7, 9, 3, 12),
      },
    ],
  },
  {
    id: 'sleep_quality_1_5',
    rules: [
      {
        axis: 'sleep',
        weight: 1.5,
        toImpact: (a) => likertImpact(a, 1, 5, true),
      },
      {
        axis: 'recovery',
        weight: 1,
        toImpact: (a) => likertImpact(a, 1, 5, true),
      },
    ],
  },

  // nutrition
  {
    id: 'protein_g_per_day',
    rules: [
      {
        axis: 'nutrition',
        weight: 1.5,
        toImpact: (a, all) => {
          const kg = toNumber(all.weight_kg);
          const p = toNumber(a);
          const gPerKg = kg > 0 ? p / kg : 0;
          // zone “solide” v1 : 1.6–2.2 g/kg
          return optimalBandImpact(gPerKg, 1.6, 2.2, 0.3, 3.5);
        },
      },
    ],
  },

  // stress
  {
    id: 'stress_level_1_5',
    rules: [
      {
        axis: 'stress',
        weight: 2,
        toImpact: (a) => likertImpact(a, 1, 5, false), // plus bas = meilleur
      },
      {
        axis: 'recovery',
        weight: 1,
        toImpact: (a) => likertImpact(a, 1, 5, false),
      },
    ],
  },

  // training
  {
    id: 'training_sessions_per_week',
    rules: [
      {
        axis: 'training',
        weight: 1.5,
        toImpact: (a) => optimalBandImpact(toNumber(a), 3, 6, 0, 14),
      },
    ],
  },
  {
    id: 'training_duration_min',
    rules: [
      {
        axis: 'training',
        weight: 1,
        toImpact: (a) => optimalBandImpact(toNumber(a), 30, 75, 0, 180),
      },
    ],
  },

  // adherence
  {
    id: 'adherence_last14d_1_5',
    rules: [
      {
        axis: 'adherence',
        weight: 2,
        toImpact: (a) => likertImpact(a, 1, 5, true),
      },
    ],
  },

  // recovery proxy (optionnel)
  {
    id: 'soreness_1_5',
    rules: [
      {
        axis: 'recovery',
        weight: 1,
        toImpact: (a) => likertImpact(a, 1, 5, false), // trop de douleurs = moins bon
      },
    ],
  },

  // metabolic flexibility proxy (très v1)
  {
    id: 'steps_per_day',
    rules: [
      {
        axis: 'recovery',
        weight: 0.75,
        toImpact: (a) => optimalBandImpact(toNumber(a), 7000, 12000, 0, 25000),
      },
      {
        axis: 'adherence',
        weight: 0.5,
        toImpact: (a) => optimalBandImpact(toNumber(a), 7000, 12000, 0, 25000),
      },
    ],
  },

  // red flags simples
  {
    id: 'has_medical_condition',
    rules: [
      {
        axis: 'stress',
        weight: 0.5,
        toImpact: (a) => boolImpact(a, false), // si true => impact 0
      },
    ],
  },
];

/* ---------------------------------------------
   Mode weights (ipt_global)
   V1 : simple mais logique. Ajustable facilement.
--------------------------------------------- */

const MODE_AXIS_WEIGHTS: Record<IPTMode, Record<AxisKey, number>> = {
  ipt: {
    sleep: 1,
    nutrition: 1,
    stress: 1,
    training: 1,
    recovery: 1,
    adherence: 1,
  },
  gplus: {
    sleep: 1,
    nutrition: 1.25,
    stress: 1,
    training: 1,
    recovery: 1,
    adherence: 1.25,
  },
  omni: {
    sleep: 1.1,
    nutrition: 1,
    stress: 1.1,
    training: 1,
    recovery: 1.2,
    adherence: 1.2,
  },
};

/* ---------------------------------------------
   Core engine
--------------------------------------------- */

export function calculateAxisScores(
  responses: Responses,
  config: QuestionConfig[] = QUESTIONS_CONFIG_V1
): Record<AxisKey, AxisScore> {
  const axes: Record<AxisKey, AxisScore> = {
    sleep: { name: 'sleep', raw_score: 0, normalized_score: 0, contributions: [] },
    nutrition: { name: 'nutrition', raw_score: 0, normalized_score: 0, contributions: [] },
    stress: { name: 'stress', raw_score: 0, normalized_score: 0, contributions: [] },
    training: { name: 'training', raw_score: 0, normalized_score: 0, contributions: [] },
    recovery: { name: 'recovery', raw_score: 0, normalized_score: 0, contributions: [] },
    adherence: { name: 'adherence', raw_score: 0, normalized_score: 0, contributions: [] },
  };

  // On garde aussi le “max possible” pour normaliser proprement
  const maxPossible: Record<AxisKey, number> = {
    sleep: 0,
    nutrition: 0,
    stress: 0,
    training: 0,
    recovery: 0,
    adherence: 0,
  };

  for (const q of config) {
    const answer = responses[q.id];
    // Si absent, on ignore (pas de pénalité v1)
    if (typeof answer === 'undefined' || answer === null || answer === '') continue;

    for (const rule of q.rules) {
      const impact = clamp01(rule.toImpact(answer, responses));
      const contribution = impact * rule.weight;

      axes[rule.axis].raw_score += contribution;
      axes[rule.axis].contributions.push({
        question_id: q.id,
        impact,
        weight: rule.weight,
      });

      // max impact = 1 * weight
      maxPossible[rule.axis] += rule.weight;
    }
  }

  // Normalisation 0-100 par axe
  for (const axis of Object.keys(axes) as AxisKey[]) {
    const max = maxPossible[axis];
    const raw = axes[axis].raw_score;

    const normalized = max > 0 ? (raw / max) * 100 : 0;

    axes[axis].normalized_score = Math.round(clamp01(normalized / 100) * 100);
    // raw_score reste utile pour debug, on le garde en float
  }

  return axes;
}

export function calculateDerivedVariables(responses: Responses): DerivedVariables {
  const sleepHours = toNumber(responses.sleep_hours_avg);

  const weightKg = toNumber(responses.weight_kg);
  const proteinPerDay = toNumber(responses.protein_g_per_day);

  const stressLikert = toNumber(responses.stress_level_1_5); // 1..5
  const sessions = toNumber(responses.training_sessions_per_week);
  const duration = toNumber(responses.training_duration_min);

  const soreness = toNumber(responses.soreness_1_5);
  const steps = toNumber(responses.steps_per_day);

  const protein_g_per_kg = weightKg > 0 ? proteinPerDay / weightKg : 0;

  // Proxies v1 (simples, cohérents, remplaçables)
  const stress_score_proxy = stressLikert > 0 ? (stressLikert - 1) / 4 : 0; // 0..1 (1 = stress haut)
  const training_load = clamp01((sessions * duration) / (6 * 75)); // ~1 quand 6x75min
  const recovery_proxy = clamp01(
    (optimalBandImpact(sleepHours, 7, 9, 3, 12) * 0.6) +
      (clamp01(1 - (soreness > 0 ? (soreness - 1) / 4 : 0)) * 0.4)
  );

  const metabolic_flex_proxy = clamp01(optimalBandImpact(steps, 7000, 12000, 0, 25000));

  // Adhérence v1 : si tu as une question dédiée, elle prime, sinon proxy steps
  const adherenceLikert = toNumber(responses.adherence_last14d_1_5);
  const adherence_proxy =
    adherenceLikert > 0 ? clamp01((adherenceLikert - 1) / 4) : metabolic_flex_proxy;

  return {
    sleep_hours_avg: sleepHours,
    protein_g_per_kg,
    stress_score_proxy,
    training_load,
    recovery_proxy,
    metabolic_flex_proxy,
    adherence_proxy,
  };
}

export function calculateIPTGlobal(
  axes: Record<AxisKey, AxisScore>,
  mode: IPTMode = 'ipt'
): number {
  const w = MODE_AXIS_WEIGHTS[mode];

  let num = 0;
  let den = 0;

  (Object.keys(axes) as AxisKey[]).forEach((axis) => {
    const weight = w[axis] ?? 1;
    num += axes[axis].normalized_score * weight;
    den += weight;
  });

  if (den <= 0) return 0;
  return Math.round(num / den);
}

/**
 * Convenience: calc complet
 */
export function calculateIPTScores(
  responses: Responses,
  mode: IPTMode = 'ipt',
  config: QuestionConfig[] = QUESTIONS_CONFIG_V1
): { scores: IPTScores; derived: DerivedVariables } {
  const axes = calculateAxisScores(responses, config);
  const derived = calculateDerivedVariables(responses);
  const ipt_global = calculateIPTGlobal(axes, mode);

  return {
    scores: { axes, ipt_global },
    derived,
  };
}
