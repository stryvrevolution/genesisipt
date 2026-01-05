import type { Metadata } from 'next';
// 👇 CORRECTION ICI : Utilise ./ pour dire "dans le même dossier"
import BodyFatCalculator from './BodyFatCalculator'; 

export const metadata: Metadata = {
  title: 'Calculateur Body Fat % | STRYV LAB',
  description: 'Bilan composition corporelle scientifique.',
  openGraph: {
    images: ['/og-body-fat.png'], // Next.js ira chercher ça dans le dossier public
  },
};

export default function Page() {
  return <BodyFatCalculator />;
}