// app/lib/genesis/scoring-engine.ts

// 1. DÉFINITION DES TYPES
export interface DetailedScores {
  metabolicFlexibility: number;
  circadianAlignment: number;
  inflammatoryStatus: number;
  nutrientSensing: number;
  stressResilience: number;
}

export interface GenesisResult {
  globalScore: number;
  detailedScores: DetailedScores;
  detectedPatterns: string[];
  redFlags: string[];
  rootCauses: string[];
  recommendations: string[];
}

// 2. MOTEUR DE SCORING (CLASSE)
export class GenesisScoringEngine {
  private responses: Record<string, any>;
  private detailedScores: DetailedScores;
  private detectedPatterns: string[];
  private redFlags: string[];
  private rootCauses: string[];

  constructor(responses: Record<string, any>) {
    this.responses = responses;
    
    // Initialisation des valeurs par défaut
    this.detailedScores = {
      metabolicFlexibility: 50, // On part de 50 (neutre)
      circadianAlignment: 50,
      inflammatoryStatus: 50,
      nutrientSensing: 50,
      stressResilience: 50
    };
    
    this.detectedPatterns = [];
    this.redFlags = [];
    this.rootCauses = [];
  }

  public calculate(): GenesisResult {
    this.calculateDetailedScores();
    this.detectPatterns();
    this.identifyRedFlags();
    this.identifyRootCauses();
    const globalScore = this.computeGlobalScore();

    return {
      globalScore,
      detailedScores: this.detailedScores,
      detectedPatterns: this.detectedPatterns,
      redFlags: this.redFlags,
      rootCauses: this.rootCauses,
      recommendations: this.generateRecommendations()
    };
  }

  // --- LOGIQUE INTERNE ---

  private calculateDetailedScores(): void {
    // Logique simplifiée pour éviter les erreurs de build
    // Tu pourras complexifier ici plus tard
    
    // Exemple : Si 'fatigue' est mentionné, on baisse le score métabolique
    if (this.responses.energy_levels === 'low') {
      this.detailedScores.metabolicFlexibility -= 10;
    }
    
    // Normalisation (0-100)
    this.normalizeScores();
  }

  private detectPatterns(): void {
    // Exemple simple
    if (this.detailedScores.metabolicFlexibility < 40) {
      this.detectedPatterns.push('METABOLIC_RIGIDITY');
    }
  }

  private identifyRedFlags(): void {
    // Placeholder
  }

  private identifyRootCauses(): void {
    // Placeholder
  }

  private computeGlobalScore(): number {
    const scores = Object.values(this.detailedScores);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  }

  private normalizeScores(): void {
    (Object.keys(this.detailedScores) as Array<keyof DetailedScores>).forEach(key => {
      this.detailedScores[key] = Math.max(0, Math.min(100, this.detailedScores[key])); 
    });
  }

  private generateRecommendations(): string[] {
    return ["Protocol initialization required."];
  }
}

// 3. LA FONCTION MANQUANTE (CELLE QUE TON API CHERCHE)
// C'est ici que la magie opère : on crée une fonction qui utilise la classe au-dessus.
export function calculateIPTScore(data: any): GenesisResult {
  const engine = new GenesisScoringEngine(data);
  return engine.calculate();
}