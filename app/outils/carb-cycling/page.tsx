import type { Metadata } from 'next';
import CarbCyclingCalculator from './CarbCyclingCalculator';

export const metadata: Metadata = {
  title: 'Calculateur Carb Cycling & Macro-nutrition | STRYV LAB',
  description: 'Optimisez votre perte de gras et préservez votre muscle grâce au Carb Cycling. Protocole nutritionnel cyclique basé sur votre masse maigre.',
  
  openGraph: {
    title: 'Calculateur Carb Cycling Pro | STRYV LAB',
    description: 'Alternez jours hauts et bas en glucides pour sécher sans perdre de muscle.',
    url: 'https://www.stryvlab.com/outils/carb-cycling',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-carb-cycling.png', // Ton image orange
        width: 1200,
        height: 630,
        alt: 'Calculateur Carb Cycling Stryv Lab',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur Carb Cycling Pro | STRYV LAB',
    description: 'Générez votre plan nutritionnel cyclique en 1 clic.',
    images: ['/og-carb-cycling.png'],
  },
};

export default function Page() {
  return <CarbCyclingCalculator />;
}