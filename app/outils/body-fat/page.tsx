import type { Metadata } from 'next';
import BodyFatCalculator from './BodyFatCalculator';

export const metadata: Metadata = {
  title: 'Body Fat Calculator - Composition Corporelle | STRYV LAB',
  description: 'Calculateur de masse grasse scientifique. US Navy Method et Jackson-Pollock 3-Site. Précision ±3-5%. Catégories ACE standards professionnels.',
  
  openGraph: {
    title: 'Body Fat Calculator Pro | STRYV LAB',
    description: 'Analysez votre composition corporelle avec précision scientifique.',
    url: 'https://www.stryvlab.com/outils/body-fat',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-bodyfat.png',
        width: 1200,
        height: 630,
        alt: 'Body Fat Calculator STRYV LAB',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Body Fat Calculator Pro | STRYV LAB',
    description: 'Composition corporelle de précision.',
    images: ['/og-bodyfat.png'],
  },
};

export default function BodyFatPage() {
  return <BodyFatCalculator />;
}