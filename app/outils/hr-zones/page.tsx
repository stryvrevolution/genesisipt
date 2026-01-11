import type { Metadata } from 'next';
import HRZonesCalculator from './HRZonesCalculator';

export const metadata: Metadata = {
  title: 'HR Zones Calculator - Zones Cardiaques | STRYV LAB',
  description: 'Calculateur de zones cardiaques scientifique. Méthode Karvonen (FC réserve). Formules Tanaka 2001 & Gulati 2010. 6 zones ACSM validées.',
  
  openGraph: {
    title: 'HR Zones Calculator Pro | STRYV LAB',
    description: 'Définissez vos zones d\'intensité cardiaque pour un entraînement optimal.',
    url: 'https://www.stryvlab.com/outils/hr-zones',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-hrzones.png',
        width: 1200,
        height: 630,
        alt: 'HR Zones Calculator STRYV LAB',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'HR Zones Calculator Pro | STRYV LAB',
    description: 'Optimisez votre cardio avec la méthode Karvonen.',
    images: ['/og-hrzones.png'],
  },
};

export default function HRZonesPage() {
  return <HRZonesCalculator />;
}