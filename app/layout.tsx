import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './typography.css';

// Polices
const azonix = localFont({
  src: './fonts/Azonix.otf',
  variable: '--font-azonix',
  display: 'swap',
});

const ramabhadra = localFont({
  src: './fonts/Ramabhadra-Regular.ttf',
  variable: '--font-ramabhadra',
  display: 'swap',
});

const outfit = localFont({
  src: './fonts/Outfit-VariableFont_wght.ttf',
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STRYV Lab',
  description: 'Algorithmes de performance humaine et bio-données.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="fr">
      <body
        className={`${azonix.variable} ${ramabhadra.variable} ${outfit.variable} font-outfit antialiased bg-[#0E0E0E] text-white`}
      >
        {children}
      </body>
    </html>
  );
}