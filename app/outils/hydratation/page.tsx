import type { Metadata } from 'next';
import HydrationCalculator from './HydratationCalculator';

export const metadata: Metadata = {
  title: 'Hydration Calculator - Besoins Hydriques | STRYV LAB',
  description: 'Calculateur d\'hydratation scientifique. Base EFSA 2010 (35ml/kg). Ajustements ACSM 2007 activité/climat. Prévention déshydratation et optimisation performance.',
  
  openGraph: {
    title: 'Hydration Calculator Pro | STRYV LAB',
    description: 'Combien d\'eau boire vraiment ? Calculez vos besoins précis.',
    url: 'https://www.stryvlab.com/outils/hydratation',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-hydratation.png',
        width: 1200,
        height: 630,
        alt: 'Hydration Calculator STRYV LAB',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hydration Calculator Pro | STRYV LAB',
    description: 'Optimisez votre hydratation pour la performance.',
    images: ['/og-hydratation.png'],
  },
};

export default function HydrationPage() {
  return <HydrationCalculator />;
}