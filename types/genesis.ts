// =====================================================
// GENESIS IPT - TYPESCRIPT TYPES
// À placer dans: types/genesis.ts
// =====================================================

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
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPTScore {
  id: string;
  submissionId: string;
  iptScore: number;
  iptCategory: 'CRITIQUE' | 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' | 'EXCELLENT';
  metabolicScore: number;
  infrastructureScore: number;
  psychologyScore: number;
  physiologyScore: number;
  adherenceScore: number;
  detectedPatterns: DetectedPattern[];
  redFlags: RedFlag[];
  rootCauses: RootCause[];
  recommendations: Recommendation[];
  detailedScores: DetailedScores;
  calculatedAt: Date;
  createdAt: Date;
}

export interface DetectedPattern {
  patternId: string;
  patternName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  relatedQuestions: string[];
  impact: string;
}

export interface RedFlag {
  type: 'MEDICAL' | 'METABOLIC' | 'PSYCHOLOGICAL' | 'HORMONAL' | 'ENVIRONMENTAL';
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  actionRequired: string;
  relatedPatterns: string[];
}

export interface RootCause {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  scientificBasis: string;
}

export interface Recommendation {
  category: 'NUTRITION' | 'TRAINING' | 'RECOVERY' | 'MEDICAL' | 'LIFESTYLE';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  timeline: string;
}

export interface DetailedScores {
  [dimension: string]: {
    score: number;
    weight: number;
    breakdown: {
      [subdimension: string]: number;
    };
  };
}

export interface IPTCategory {
  scoreMin: number;
  scoreMax: number;
  category: 'CRITIQUE' | 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ' | 'EXCELLENT';
  description: string;
  color: string;
}

export interface SessionStats {
  questionsAnswered: number;
  questionsTotal: number;
  completionPercentage: number;
  timeElapsed: number;
  timeEstimatedRemaining: number;
  averageTimePerQuestion: number;
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