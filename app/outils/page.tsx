import type { Metadata } from 'next';
import ToolsGrid from './ToolsGrid'; // Import de ton design

export const metadata: Metadata = {
  title: 'Tools Hub | STRYV LAB',
  description: 'Accédez aux calculateurs de précision pour l\'optimisation métabolique, hormonale et de la performance (Macros, Body Fat, Cycle Sync...).',
  openGraph: {
    title: 'Tools Hub | STRYV LAB',
    description: 'La suite d\'outils pour transformer votre physique.',
    url: 'https://www.stryvlab.com/outils',
    siteName: 'STRYV LAB',
    images: [
      {
        url: '/og-toolshub.jpg', // L'image que tu as fournie
        width: 1200,
        height: 630,
        alt: 'STRYV Lab Tools Hub',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools Hub | STRYV LAB',
    description: 'La suite d\'outils métaboliques pour transformer votre physique.',
    images: ['/og-toolshub.png'],
  },
};

export default function Page() {
  return <ToolsGrid />;
}