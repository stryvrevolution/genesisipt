/**
 * Données physiologiques par phase menstruelle
 * Toutes les données sont en français (monolingue)
 */
export const CYCLE_PHASES = {
  menstrual: {
    bmrMultiplier: 1.00,
    proteinMultiplier: 2.2,
    fatsMultiplier: 1.1,
    
    // NOUVEAU: Potentiel performance (0-100)
    performancePotential: {
      force: 60,
      endurance: 55,
      recovery: 40,
      volumeTolerance: 50,
      hiitTolerance: 40,
      fatLoss: 65
    },
    
    // NOUVEAU: Focus priorités par objectif
    focusPriorities: {
      deficit: [
        { priority: 1, action: "Récupération active prioritaire", icon: "🧘" },
        { priority: 2, action: "Volume réduit -20%", icon: "📉" },
        { priority: 3, action: "Intensité modérée 60-70%", icon: "⚖️" },
        { priority: 4, action: "Sommeil 8h+ impératif", icon: "💤" }
      ],
      maintenance: [
        { priority: 1, action: "Focus mobilité & technique", icon: "🧘" },
        { priority: 2, action: "Maintien calorique baseline", icon: "⚖️" },
        { priority: 3, action: "Récupération active", icon: "🚶" }
      ],
      surplus: [
        { priority: 1, action: "Deload si besoin", icon: "😴" },
        { priority: 2, action: "Volume très réduit", icon: "📉" },
        { priority: 3, action: "Récupération prioritaire", icon: "💤" }
      ]
    },
    
    insights: [
      { icon: '🩸', text: 'Inflammation élevée: Privilégier aliments anti-inflammatoires (oméga-3, curcuma)' },
      { icon: '💤', text: 'Énergie basse: Sommeil 8h+ recommandé' },
      { icon: '🧘', text: 'Récupération prioritaire: Yoga, marche, mobilité' }
    ]
  },
  
  follicular: {
    bmrMultiplier: 1.00,
    proteinMultiplier: 2.5,
    fatsMultiplier: 0.95,
    
    performancePotential: {
      force: 85,
      endurance: 75,
      recovery: 90,
      volumeTolerance: 85,
      hiitTolerance: 90,
      fatLoss: 95  // ⭐ FENÊTRE OPTIMALE
    },
    
    focusPriorities: {
      deficit: [
        { priority: 1, action: "Déficit agressif -20-25% (fenêtre optimale)", icon: "🔥" },
        { priority: 2, action: "Progressions lourdes 80-90% 1RM", icon: "💪" },
        { priority: 3, action: "Volume MAX +20-30%", icon: "📈" },
        { priority: 4, action: "HIIT haute intensité", icon: "⚡" }
      ],
      maintenance: [
        { priority: 1, action: "Progressions force maximales", icon: "💪" },
        { priority: 2, action: "Volume élevé bien toléré", icon: "📈" },
        { priority: 3, action: "HIIT & conditionnement", icon: "⚡" }
      ],
      surplus: [
        { priority: 1, action: "Hypertrophie volume maximal", icon: "💪" },
        { priority: 2, action: "Surplus +200 kcal optimal", icon: "📈" },
        { priority: 3, action: "Glucides maximaux", icon: "🍚" },
        { priority: 4, action: "Fenêtre anabolique au pic", icon: "🔥" }
      ]
    },
    
    insights: [
      { icon: '💪', text: 'Force musculaire au pic: Fenêtre optimale pour progressions lourdes' },
      { icon: '🍚', text: 'Sensibilité insuline maximale: Glucides performent optimalement' },
      { icon: '⚡', text: 'Récupération rapide: HIIT et volume élevé bien tolérés' },
      { icon: '🔥', text: 'Fenêtre anabolique: Synthèse protéique maximale' }
    ]
  },
  
  ovulatory: {
    bmrMultiplier: 1.02,
    proteinMultiplier: 2.6,
    fatsMultiplier: 0.9,
    
    performancePotential: {
      force: 100,  // ⭐ PIC ABSOLU
      endurance: 80,
      recovery: 85,
      volumeTolerance: 90,
      hiitTolerance: 95,
      fatLoss: 85
    },
    
    focusPriorities: {
      deficit: [
        { priority: 1, action: "Tests 1RM & PRs (pic absolu)", icon: "🏆" },
        { priority: 2, action: "Intensité maximale 85-95%", icon: "💯" },
        { priority: 3, action: "Volume modéré-élevé", icon: "📊" },
        { priority: 4, action: "Hydratation ++ (température ⬆️)", icon: "💧" }
      ],
      maintenance: [
        { priority: 1, action: "Tests force maximale", icon: "🏆" },
        { priority: 2, action: "PRs & records personnels", icon: "💯" },
        { priority: 3, action: "Intensité très élevée", icon: "⚡" }
      ],
      surplus: [
        { priority: 1, action: "Pic force pour PRs", icon: "🏆" },
        { priority: 2, action: "Volume hypertrophie élevé", icon: "💪" },
        { priority: 3, action: "Surplus maintenu +200 kcal", icon: "📈" }
      ]
    },
    
    insights: [
      { icon: '🏆', text: 'Pic absolu de force: Période idéale pour tests 1RM' },
      { icon: '🌡️', text: 'Température corporelle +0.5°C: Hydratation accrue recommandée' },
      { icon: '💯', text: 'Performance maximale: Profiter de cette fenêtre de 3 jours' }
    ]
  },
  
  luteal_early: {
    bmrMultiplier: 1.06,
    proteinMultiplier: 2.4,
    fatsMultiplier: 1.15,
    
    performancePotential: {
      force: 70,
      endurance: 65,
      recovery: 60,
      volumeTolerance: 60,
      hiitTolerance: 55,
      fatLoss: 60
    },
    
    focusPriorities: {
      deficit: [
        { priority: 1, action: "Intensité > Volume", icon: "🎯" },
        { priority: 2, action: "Training force relative (clusters)", icon: "💪" },
        { priority: 3, action: "Volume réduit -10%", icon: "📉" },
        { priority: 4, action: "Déficit modéré -15% (métabolisme ⬆️)", icon: "🔥" }
      ],
      maintenance: [
        { priority: 1, action: "Intensité maintenue", icon: "💪" },
        { priority: 2, action: "Volume réduit légèrement", icon: "📉" },
        { priority: 3, action: "Repos 3-4min entre séries", icon: "⏱️" }
      ],
      surplus: [
        { priority: 1, action: "Surplus réduit +100 kcal", icon: "📊" },
        { priority: 2, action: "Lipides augmentés vs glucides", icon: "🥑" },
        { priority: 3, action: "Volume modéré", icon: "⚖️" }
      ]
    },
    
    insights: [
      { icon: '🔥', text: 'Métabolisme +6%: Besoins caloriques augmentés (+100-150 kcal)' },
      { icon: '🥑', text: 'Sensibilité insuline réduite: Favoriser lipides vs glucides' },
      { icon: '⏱️', text: 'Récupération rallongée: Repos inter-séries 3-4min' }
    ]
  },
  
  luteal_late: {
    bmrMultiplier: 1.09,
    proteinMultiplier: 2.3,
    fatsMultiplier: 1.2,
    
    performancePotential: {
      force: 50,
      endurance: 45,
      recovery: 30,
      volumeTolerance: 35,
      hiitTolerance: 25,
      fatLoss: 40
    },
    
    focusPriorities: {
      deficit: [
        { priority: 1, action: "DELOAD OBLIGATOIRE (-30% volume)", icon: "😴" },
        { priority: 2, action: "Déficit minimal -12% (métabolisme +9%)", icon: "⚠️" },
        { priority: 3, action: "Ne PAS se peser (rétention eau +1-3kg)", icon: "🚫" },
        { priority: 4, action: "Priorité récupération & sommeil", icon: "💤" },
        { priority: 5, action: "Yoga, marche, mobilité", icon: "🧘" }
      ],
      maintenance: [
        { priority: 1, action: "Deload semaine recommandée", icon: "😴" },
        { priority: 2, action: "Activité légère uniquement", icon: "🚶" },
        { priority: 3, action: "Gestion stress crucial", icon: "🧘" }
      ],
      surplus: [
        { priority: 1, action: "Deload obligatoire", icon: "😴" },
        { priority: 2, action: "Surplus maintenu (métabolisme ⬆️)", icon: "📈" },
        { priority: 3, action: "Focus récupération", icon: "💤" }
      ]
    },
    
    insights: [
      { icon: '📈', text: 'Métabolisme +9%: Besoins caloriques au plus haut (+150-250 kcal)' },
      { icon: '💧', text: 'Rétention eau: +1-3kg normal. Poids balance non fiable cette semaine' },
      { icon: '🍫', text: 'Cravings sucrés: Progestérone ↑ augmente appétit. Protéines/lipides aident satiété' },
      { icon: '😴', text: 'Fatigue accrue: Deload semaine recommandée' },
      { icon: '🧘', text: 'Stress élevé: Cortisol management crucial (sommeil, méditation)' }
    ]
  }
};