// =====================================================
// GENESIS IPT — SCORING ENGINE
// File: lib/genesis/scoring-engine.ts
// =====================================================
// Purpose:
// - Calculer l’IPT Score global
// - Fournir une catégorisation clinique lisible
// - Exposer un breakdown par piliers
// - MOCK contrôlé (frontend-safe) en attendant le moteur final
// =====================================================

import { IPTResponses } from '@/types/genesis';

/* =========================
   PILLAR WEIGHTS (LOCKED)
   ========================= */
/**
 * Pondérations scientifiques des piliers GENESIS
 * La somme DOIT toujours = 1.00
 */
const PILLAR_WEIGHTS = {
  METABOLIC: 0.30,
  INFRASTRUCTURE: 0.25,
  PSYCHOLOGY: 0.20,
  PHYSIOLOGY: 0.15,
  ADHERENCE: 0.10,
} as const;

/* =========================
   TYPES
   ========================= */

export type IPTCategory =
  | 'CRITIQUE'
  | 'FAIBLE'
  | 'MOYEN'
  | 'ÉLEVÉ'
  | 'EXCELLENT';

export interface IPTBreakdown {
  metabolic: number;
  infrastructure: number;
  psychology: number;
  physiology: number;
  adherence: number;
}

export interface IPTResult {
  iptScore: number;
  category: IPTCategory;
  breakdown: IPTBreakdown;
}

/* =========================
   SCORING ENGINE
   ========================= */

export class GenesisScoringEngine {
  private responses: IPTResponses;

  constructor(responses: IPTResponses) {
    this.responses = responses;
  }

  /**
   * Calcul principal IPT
   * ⚠️ MOCK TEMPORAIRE — volontairement déterministe
   * (aucun Math.random en production finale)
   */
  public calculate(): IPTResult {
    // MOCK contrôlé pour éviter tout crash frontend
    // et garder une cohérence visuelle pendant le design
    const mockScore = 68;

    return {
      iptScore: mockScore,
      category: this.getIPTCategory(mockScore),
      breakdown: {
        metabolic: 72,
        infrastructure: 64,
        psychology: 78,
        physiology: 58,
        adherence: 85,
      },
    };
  }

  /**
   * Catégorisation clinique IPT
   */
  private getIPTCategory(score: number): IPTCategory {
    if (score < 25) return 'CRITIQUE';
    if (score < 45) return 'FAIBLE';
    if (score < 65) return 'MOYEN';
    if (score < 85) return 'ÉLEVÉ';
    return 'EXCELLENT';
  }
}

/* =========================
   HELPER
   ========================= */

export function calculateIPTScore(
  responses: IPTResponses
): IPTResult {
  const engine = new GenesisScoringEngine(responses);
  return engine.calculate();
}

/* =========================
   NOTES IMPORTANTES
   ========================= */
/*
  - Aucun hasard dans le mock :
    → UI stable
    → Design cohérent
    → Debug simple

  - La structure du retour (IPTResult) est FINALE.
    Le moteur réel remplacera uniquement le contenu de calculate().

  - Ce fichier parle le langage GENESIS :
    SCORE / PILIERS / CATÉGORIE
    Pas de gamification. Pas de marketing.
*/
