// app/outils/body-fat/layout.tsx
import { Metadata } from 'next';

// --- SEO METADATA 2025-2026 ---
export const metadata: Metadata = {
  title: 'Calculateur Body Fat % : Masse Grasse US Navy & Jackson-Pollock | STRYV LAB',
  description: 'Calculateur body fat scientifique. Méthodes US Navy (1984) & Jackson-Pollock (1978). Catégorisation ACE Standards. Précision ±3-5%. Composition corporelle optimale. Gratuit.',
  keywords: 'body fat calculator, calculateur masse grasse, US Navy body fat, Jackson-Pollock, composition corporelle, LBM, ACE standards, pourcentage graisse, DEXA alternative, bf%',
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
    url: 'https://stryv-lab.com/outils/body-fat',
    title: 'Calculateur Body Fat % : Masse Grasse US Navy & Jackson-Pollock',
    description: 'Calculateur body fat scientifique. US Navy (1984) & Jackson-Pollock (1978). ACE Standards. Gratuit.',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-body-fat.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculateur Body Fat % Pro STRYV LAB',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculateur Body Fat % : Masse Grasse US Navy & Jackson-Pollock',
    description: 'Calculateur body fat scientifique. US Navy (1984) & Jackson-Pollock (1978). ACE Standards.',
    images: ['/og-body-fat.jpg'],
    creator: '@stryvlab',
  },
  alternates: {
    canonical: 'https://stryv-lab.com/outils/body-fat',
  },
};

export default function BodyFatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}