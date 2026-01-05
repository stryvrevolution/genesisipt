import type { Metadata } from 'next';
import OneRMCalculator from './OneRMCalculator'; // Assure-toi que le nom du fichier est correct

export const metadata: Metadata = {
  title: 'Calculateur 1RM & Charges d\'entraînement | STRYV LAB',
  description: 'Estimez votre One Rep Max (1RM) et générez automatiquement vos charges de travail pour la force et l\'hypertrophie. Méthode scientifique (Brzycki, Epley, Lombardi).',
  
  openGraph: {
    title: 'Calculateur 1RM Pro | STRYV LAB',
    description: 'Calculez votre force maximale et vos % de charge instantanément.',
    url: 'https://www.stryvlab.com/outils/1rm',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-1rm-calculator.png', // Ton image jaune
        width: 1200,
        height: 630,
        alt: 'Calculateur 1RM Stryv Lab',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur 1RM Pro | STRYV LAB',
    description: 'Générez vos charges d\'entraînement en 1 clic.',
    images: ['/og-1rm-calculator.png'],
  },
};

export default function Page() {
  return <OneRMCalculator />;
}