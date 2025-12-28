// GENESIS IPT - Scoring Engine (Version MVP Simplifiée)
import { IPTResponses } from '@/types/genesis';

export function calculateIPTScore(responses: IPTResponses) {
  // Version MVP - Scores fixes pour tester
  // TODO: Implémenter logique complète basée sur réponses
  
  const metabolicScore = 70;
  const infrastructureScore = 65;
  const psychologyScore = 75;
  const physiologyScore = 80;
  const adherenceScore = 60;

  // Calcul IPT final (moyenne pondérée)
  const iptScore = (
    metabolicScore * 0.30 +
    infrastructureScore * 0.25 +
    psychologyScore * 0.20 +
    physiologyScore * 0.15 +
    adherenceScore * 0.10
  );

  // Déterminer catégorie
  const getCategory = (score: number) => {
    if (score < 25) return 'CRITIQUE';
    if (score < 45) return 'FAIBLE';
    if (score < 65) return 'MOYEN';
    if (score < 85) return 'ÉLEVÉ';
    return 'EXCELLENT';
  };

  return {
    iptScore: Math.round(iptScore * 100) / 100,
    iptCategory: getCategory(iptScore),
    metabolicScore,
    infrastructureScore,
    psychologyScore,
    physiologyScore,
    adherenceScore,
    detectedPatterns: [
      {
        patternId: 'P1',
        patternName: 'Résistance Insuline (détection MVP)',
        severity: 'medium',
        description: 'Pattern détecté - logique complète à implémenter'
      }
    ],
    redFlags: [],
    rootCauses: [],
    recommendations: [
      {
        category: 'NUTRITION',
        priority: 'high',
        title: 'Optimisation Métabolique',
        description: 'Recommandations personnalisées à générer',
      }
    ],
    detailedScores: {},
  };
}