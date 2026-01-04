// app/outils/1rm-calculator/layout.tsx
import { Metadata } from 'next';

// --- SEO METADATA 2025-2026 ---
export const metadata: Metadata = {
  title: 'Calculateur 1RM Pro : Estimez Votre Charge Maximale | STRYV LAB',
  description: 'Calculateur 1RM scientifique basé sur formules Brzycki, Epley, Lombardi. Déterminez votre charge maximale et zones d\'entraînement précises. Validé NSCA. Gratuit.',
  keywords: '1rm calculator, calculateur 1rm, one rep max, charge maximale, brzycki, epley, lombardi, zones entraînement, force maximale, powerlifting, musculation, NSCA, calculateur force',
  authors: [{ name: 'STRYV LAB', url: 'https://stryv-lab.com' }],
  creator: 'STRYV LAB',
  publisher: 'STRYV LAB',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://stryv-lab.com/outils/1rm-calculator',
    title: 'Calculateur 1RM Pro : Estimez Votre Charge Maximale',
    description: 'Calculateur 1RM scientifique : formules Brzycki, Epley, Lombardi. Zones d\'entraînement validées NSCA. Gratuit.',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-1rm-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculateur 1RM Pro STRYV LAB',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur 1RM Pro : Estimez Votre Charge Maximale',
    description: 'Calculateur 1RM scientifique : formules Brzycki, Epley, Lombardi. Zones d\'entraînement validées NSCA.',
    images: ['/og-1rm-calculator.jpg'],
    creator: '@stryvlab',
  },
  alternates: {
    canonical: 'https://stryv-lab.com/outils/1rm-calculator',
  },
};

export default function RMCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}