import type { Metadata } from 'next';
import CycleSyncCalculator from './CycleSyncCalculator';

export const metadata: Metadata = {
  title: 'Cycle Sync Calculator - Nutrition Hormonale | STRYV LAB',
  description: 'Synchronisez nutrition et training avec votre cycle menstruel. Ajustements scientifiques selon les 4 phases (Davidsen 2007, Oosthuyse 2010).',
  
  openGraph: {
    title: 'Cycle Sync Calculator Pro | STRYV LAB',
    description: 'Optimisez vos performances hormonales cycle par cycle.',
    url: 'https://www.stryvlab.com/outils/cycle-sync',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-cyclesync.png',
        width: 1200,
        height: 630,
        alt: 'Cycle Sync Calculator STRYV LAB',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cycle Sync Calculator Pro | STRYV LAB',
    description: 'Nutrition hormonale de précision.',
    images: ['/og-cyclesync.png'],
  },
};

export default function CycleSyncPage() {
  return <CycleSyncCalculator />;
}