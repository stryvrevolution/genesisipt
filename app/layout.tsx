import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import GenesisAssistant from '@/components/GenesisAssistant';


/* =====================================================
   FONT CONFIGURATION
   ===================================================== */
// 1. LUFGA (Principale / Corps de texte / "lab")
const lufga = localFont({
  src: [
    { path: './fonts/Lufga/Lufga-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Lufga/Lufga-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Lufga/Lufga-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-lufga',
  display: 'swap',
});

// 2. AZONIX (Logo "S" uniquement)
const azonix = localFont({
  src: './fonts/AzonixRegular.woff2',
  variable: '--font-azonix',
  display: 'swap',
});

// 3. ONEST (Logo "tryv" uniquement)
const onest = localFont({
  src: './fonts/Onest/Onest-Bold.woff2',
  variable: '--font-onest',
  display: 'swap',
});

/* =====================================================
   VIEWPORT
   ===================================================== */
export const viewport: Viewport = {
  themeColor: '#ededed',
  width: 'device-width',
  initialScale: 1,
};

/* =====================================================
   METADATA — STRYV LAB (STRATÉGIE "LABORATOIRE")
   ===================================================== */
export const metadata: Metadata = {
  metadataBase: new URL('https://www.stryvlab.com'),

  title: {
    default: 'STRYV lab — laboratoire d’ingénierie du potentiel humain',
    template: '%s | STRYV lab',
  },

  description:
    "STRYV lab est un laboratoire d’ingénierie du potentiel humain. Nous mesurons, modélisons et orchestrons la transformation à partir de données réelles via des systèmes propriétaires comme l’IPT™, sans promesse, sans standardisation.",

  keywords: [
    'ingénierie du potentiel humain',
    'indice de potentiel de transformation',
    'analyse IPT',
    'transformation basée sur les données',
    'systèmes adaptatifs de transformation',
    'laboratoire de performance humaine',
    'optimisation long terme',
    'STRYV lab',
    'STRYV',
    'GENESIS',
    'IPT',
    'Mons',
    'Belgique',
  ],

  authors: [{ name: 'STRYV lab' }],
  creator: 'STRYV lab',
  publisher: 'STRYV lab',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: 'https://www.stryvlab.com',
  },

  other: {
    'geo.region': 'BE-WHT',
    'geo.placename': 'Mons',
    'geo.position': '50.4542;3.9567',
    ICBM: '50.4542, 3.9567',
  },

  openGraph: {
    title: 'STRYV lab — laboratoire d’ingénierie du potentiel humain',
    description:
      'Nous ne promettons pas la transformation. Nous mesurons si elle est possible.',
    url: 'https://www.stryvlab.com',
    siteName: 'STRYV lab',
    locale: 'fr_BE',
    type: 'website',
    images: [
      {
        url: '/images/og-stryv.png',
        width: 1200,
        height: 630,
        alt: 'STRYV lab — ingénierie du potentiel humain',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'STRYV lab — laboratoire d’ingénierie du potentiel humain',
    description:
      'Mesurer avant d’agir. Orchestrer plutôt que forcer.',
    images: ['/images/og-stryv.png'],
  },
};

/* =====================================================
   STRUCTURED DATA — SCHEMA.ORG
   ===================================================== */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ResearchOrganization", "ProfessionalService"],
      "@id": "https://www.stryvlab.com/#organization",
      "name": "STRYV lab",
      "alternateName": ["STRYV", "STRYV Genesis", "STRYV Lab Genesis"],
      "description":
        "Laboratoire d’ingénierie du potentiel humain développant des systèmes propriétaires de mesure et d’orchestration de la transformation.",
      "url": "https://www.stryvlab.com",
      "logo": "https://www.stryvlab.com/logo-stryv.png",
      "image": "https://www.stryvlab.com/images/og-stryv.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mons",
        "postalCode": "7000",
        "addressCountry": "BE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 50.4542,
        "longitude": 3.9567
      },
      "areaServed": "BE",
      "knowsAbout": [
        "ingénierie du potentiel humain",
        "indice de potentiel de transformation",
        "systèmes adaptatifs",
        "adhérence comportementale",
        "optimisation long terme",
        "systèmes propriétaires de mesure du potentiel",
        "modélisation adaptative de la transformation humaine",
        "évaluation de capacité de transformation"
      ],
      "sameAs": [
        "https://www.instagram.com/stryvlab",
        "https://www.linkedin.com/company/stryvlab"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.stryvlab.com/#website",
      "url": "https://www.stryvlab.com",
      "name": "STRYV lab",
      "publisher": {
        "@id": "https://www.stryvlab.com/#organization"
      },
      "inLanguage": "fr-BE"
    }
  ]
};

/* =====================================================
   ROOT LAYOUT
   ===================================================== */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Injection des 3 variables de police pour utilisation CSS globale
    <html lang="fr" className={`${lufga.variable} ${azonix.variable} ${onest.variable}`}>
      <body className="antialiased min-h-screen bg-background text-primary">
        {children}

        {/* SCHEMA.ORG */}
        <Script
          id="stryv-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GenesisAssistant />
      </body>
    </html>
  );
}