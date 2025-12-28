// Types GENESIS IPT - Version simplifiée pour démarrage rapide

export interface GenesisQuestion {
  id: string;
  dimension: string;
  patterns: string[];
  role: 'TRIGGER' | 'PRIMARY' | 'SECONDARY';
  question: string;
  type: 'Numérique' | 'Choix unique' | 'Choix multiple' | 'Échelle 1-10';
  options: string[];
  triggerCondition: string;
  skipCondition: string;
  rootCauseLink: string;
  impactScore: number;
  scientificRef: string;
}

export type QuestionResponse = string | number | string[];

export interface IPTResponses {
  [questionId: string]: QuestionResponse;
}

export interface IPTSubmission {
  id: string;
  email?: string;
  userId?: string;
  sessionId: string;
  startedAt: Date;
  completedAt?: Date;
  lastUpdatedAt: Date;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  responses: IPTResponses;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPTScore {
  id: string;
  submissionId: string;
  iptScore: number;
  iptCory: 'CRITIQUE' | 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' | 'EXCELLENT';
  metabolicScore: number;
  infrastructureScore: number;
  psychologyScore: number;
  physiologyScore: number;
  adherenceScore: number;
  detectedPatterns: any[];
  redFlags: any[];
  rootCauses: any[];
  recommendations: any[];
  detailedScores: any;
  calculatedAt: Date;
  createdAt: Date;
}

export type ScoringPillar = 
  | 'METABOLIC'
  | 'INFRASTRUCTURE'
  | 'PSYCHOLOGY'
  | 'PHYSIOLOGY'
  | 'ADHERENCE';

export const PILLAR_WEIGHTS: Record<ScoringPillar, number> = {
  METABOLIC: 0.30,
  INFRASTRUCTURE: 0.25,
  PSYCHOLOGY: 0.20,
  PHYSIOLOGY: 0.15,
  ADHERENCE: 0.10,
};
