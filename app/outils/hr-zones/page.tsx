import type { Metadata } from 'next';
import HRZonesCalculator from './HRZonesCalculator';

export const metadata: Metadata = {
  title: 'Calculateur Zones Cardiaques & FC Max | STRYV LAB',
  description: 'Calculez vos zones d\'entraînement cardiaque (FC Max, FC Réserve, Karvonen). Optimisez votre endurance et votre perte de gras avec précision.',
  
  openGraph: {
    title: 'Calculateur HR Zones Pro | STRYV LAB',
    description: 'Définissez vos zones d\'intensité cardiaque pour un entraînement optimal.',
    url: 'https://www.stryvlab.com/outils/hr-zones',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-hr-zones.png', // Assure-toi d'avoir cette image
        width: 1200,
        height: 630,
        alt: 'Calculateur HR Zones Stryv Lab',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur HR Zones Pro | STRYV LAB',
    description: 'Optimisez votre cardio avec la méthode Karvonen.',
    images: ['/og-hr-zones.png'],
  },
};

export default function Page() {
  return <HRZonesCalculator />;
}