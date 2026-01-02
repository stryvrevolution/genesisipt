import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import '../typography.css';
// Utilisation d'un chemin relatif pour forcer la détection par l'IDE
import { LanguageProvider } from '../../lib/context/LanguageContext';

// 1. Polices (Chemins ../ car le fichier est dans app/[lang]/)
const azonix = localFont({
  src: '../fonts/Azonix.otf',
  variable: '--font-azonix',
  display: 'swap',
});

const ramabhadra = localFont({
  src: '../fonts/Ramabhadra-Regular.ttf',
  variable: '--font-ramabhadra',
  display: 'swap',
});

const outfit = localFont({
  src: '../fonts/Outfit-VariableFont_wght.ttf',
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STRYV Lab',
  description: 'Algorithmes de performance humaine et bio-données.',
};

// Interface pour typer les props de Next.js
interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  return (
    <html lang={params.lang}>
      <body
        className={`${azonix.variable} ${ramabhadra.variable} ${outfit.variable} font-outfit antialiased bg-[#0E0E0E] text-white`}
      >
        <LanguageProvider initialLanguage={params.lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}