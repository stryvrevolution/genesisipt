import '@/app/globals.css';
import { Footer } from '@/app/components/Footer';
import { Inter, Sora, JetBrains_Mono } from 'next/font/google';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONTS CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap', // Performance optimization
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Ajout 700 pour headers
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Poids spécifiques pour code/data
  variable: '--font-mono',
  display: 'swap',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata = {
  title: 'GENESIS by STRYV LAB — Forensic Metabolic Coaching',
  description: 'Système d\'analyse métabolique forensique pour transformation physique basée sur la science. IPT scoring, root cause analysis, protocoles personnalisés.',
  keywords: ['GENESIS', 'IPT', 'coaching métabolique', 'transformation', 'STRYV LAB'],
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
// ROOT LAYOUT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${sora.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-black text-white">
        {/* Main Content Wrapper */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* Footer Global (auto-hidden sur /genesis via CSS ou logic) */}
        <Footer />

        {/* Optional: Grain Texture Overlay (désactivable) */}
        <div 
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />
      </body>
    </html>
  );
}