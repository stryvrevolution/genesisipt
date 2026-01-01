export type Language = 'fr' | 'en'

export const translations = {
  fr: {
    // Structure attendue par la page Outils
    toolsPage: {
      labLabel: 'LABORATOIRE MÉTABOLIQUE',
      title: 'Outils de Précision',
      subtitle: 'Des calculateurs basés sur les équations de référence (Mifflin-St Jeor, Katch-McArdle) pour optimiser votre métabolisme.',
      access: 'Accéder à l\'outil',
      tools: {
        macros: {
          title: 'Calculateur Macros',
          description: 'Définissez vos besoins énergétiques précis selon votre profil neuro-métabolique.'
        },
        bodyFat: {
          title: 'Masse Grasse',
          description: 'Estimez votre taux de graisse corporelle avec la méthode US Navy.'
        },
        carbCycling: {
          title: 'Carb Cycling',
          description: 'Planifiez vos cycles de glucides pour maximiser la perte de gras.'
        },
        hrZones: {
          title: 'Zones Cardiaques',
          deculez vos zones d\'entraînement optimales (Karvonen).'
        },
        hydratation: {
          title: 'Hydratation',
          description: 'Vos besoins hydriques précis selon l\'intensité de l\'effort.'
        },
        oneRM: {
          title: 'Calculateur 1RM',
          description: 'Estimez votre force maximale théorique sans risque de blessure.'
        }
      }
    },
    // Clés de navigation (compatibilité)
    nav: {
      home: 'Accueil',
      analysis: 'Analyse IPT',
      tools: 'Outils',
      faq: 'FAQ'
    },
    common: {
      loading: 'Chargement...',
      free: 'Gratuit'
    }
  },
  en: {
    toolsPage: {
      labLabel: 'METABOLIC LAB',
      title: 'Precision Tools',
      subtitle: 'Calculators based on reference equations (Mifflin-St Jeor, Katch-McArdle) to optimize your metabolism.',
      access: 'Access Tool',
      tools: {
        macros: {
          title: 'Macro Calculator',
          description: 'Define your precise energy needs based on your neuro-metabolic profile.'
        },
        bodyFat: {
       le: 'Body Fat',
          description: 'Estimate your body fat percentage using the US Navy method.'
        },
        carbCycling: {
          title: 'Carb Cycling',
          description: 'Plan your carb cycles to maximize fat loss.'
        },
        hrZones: {
          title: 'Heart Zones',
          description: 'Calculate your optimal training zones (Karvonen).'
        },
        hydratation: {
          title: 'Hydration',
          description: 'Your precise hydration needs based on effort intensity.'
        },
        oneRM: {
          title: '1RM Calculator',
          description: 'Estimate your theoretical maximum strength without injury risk.'
        }
      }
    },
    nav: {
      home: 'Home',
      analysis: 'IPT Analysis',
      tools: 'Tools',
      faq: 'FAQ'
    },
    common: {
      loading: 'Loading...',
      free: 'Free'
    }
  }
}

// Nouvelle fonction qui renvoie l'objet entier (le dictionnaire)
export function getTranslation(lang: Language = 'fr') {
  return translations[lang] || translations['fr']
}
