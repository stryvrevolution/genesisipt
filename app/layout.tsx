import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './typography.css'; // On garde votre fichier css au cas où

// 1. Configurer Azonix (Logo "STRYV")
const azonix = localFont({
  src: './fonts/Azonix.otf',
  variable: '--font-azonix',
  display: 'swap',
});

// 2. Configurer Ramabhadra (Titres H1, H2)
const ramabhadra = localFont({
  src: './fonts/Ramabhadra-Regular.ttf',
  variable: '--font-ramabhadra',
  display: 'swap',
});

// 3. Configurer Outfit (Logo "lab", Textes, autres titres)
// On utilise la version Variable pour avoir toutes les graisses (Thin à Black)
const outfit = localFont({
  src: './fonts/Outfit-VariableFont_wght.ttf',
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Genesis Lab',
  description: 'Application Genesis Lab',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        // On injecte les 3 variables de police
        // "font-outfit" est mis par défaut pour tout le texte du site
        className={`${azonix.variable} ${ramabhadra.variable} ${outfit.variable} font-outfit antialiased bg-bg text-white`}
      >
        {children}
      </body>
    </html>
  );
}