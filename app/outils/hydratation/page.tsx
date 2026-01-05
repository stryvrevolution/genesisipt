import type { Metadata } from 'next';
import HydratationCalculator from './HydratationCalculator';

export const metadata: Metadata = {
  title: 'Calculateur Hydratation & Performance | STRYV LAB',
  description: 'Calculez vos besoins hydriques quotidiens selon votre poids, votre niveau d\'activité et le climat. Prévention déshydratation et baisse de performance.',
  
  openGraph: {
    title: 'Calculateur Hydratation Pro | STRYV LAB',
    description: 'Combien d\'eau boire vraiment ? Calculez vos besoins précis.',
    url: 'https://www.stryvlab.com/outils/hydratation',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-hydratation.png', // Ton image cyan
        width: 1200,
        height: 630,
        alt: 'Calculateur Hydratation Stryv Lab',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur Hydratation Pro | STRYV LAB',
    description: 'Optimisez votre hydratation pour la performance.',
    images: ['/og-hydratation.png'],
  },
};

export default function Page() {
  return <HydratationCalculator />;
}