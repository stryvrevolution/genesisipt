import '@/app/globals.css';
import { Footer } from '@/app/components/Footer';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONTS — STRYV LAB BRAND BOOK
// Clinical Bio-Brutalism Typography System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata = {
  title: 'GENESIS by STRYV LAB — Forensic Metabolic Coaching',
  description: 'Système d\'analyse métabolique forensique pour transformation physique basée sur la science. IPT scoring, root cause analysis, protocoles personnalisés.',
  keywords: ['GENESIS', 'IPT', 'coaching métabolique', 'transformation', 'STRYV LAB', 'forensic analysis'],
  authors: [{ name: 'Coach Stryv', url: 'https://stryvlab.com' }],
  openGraph: {
    title: 'GENESIS — Forensic Metabolic Coaching',
    description: 'Indice de Potentiel de Transformation scientifiquement validé',
    url: 'https://stryvlab.com',
    siteName: 'STRYV LAB',
    locale: 'fr_BE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROOT LAYOUT — CLINICAL BIO-BRUTALISM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Main Content Wrapper */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* Footer Global */}
        <Footer />
      </body>
    </html>
  );
}