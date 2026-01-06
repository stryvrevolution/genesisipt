import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import './typography.css';

// --- CONFIGURATION DES POLICES ---
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

// --- METADONNÉES SEO (SEO ON-PAGE) ---
export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.stryvlab.com'),
  title: {
    default: 'STRYV Lab | Coaching Sportif & Analyse Métabolique Mons',
    template: '%s | STRYV Lab'
  },
  description: 'Centre d\'ingénierie corporelle à Mons. Spécialiste de la perte de poids (IPT), gestion du cortisol et coaching haute performance pour dirigeants.',
  keywords: ['Coach sportif Mons', 'Analyse IPT', 'Perte de poids Belgique', 'Bilan métabolique', 'Coaching dirigeant', 'Stryv Lab'],
  authors: [{ name: 'Stryv Lab Team' }],
  creator: 'Stryv Lab',
  publisher: 'Stryv Lab Genesis',
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
  // CORRECTION ICI : Utilisation de 'other' pour les meta tags géo personnalisés
  other: {
    'geo.region': 'BE-WHT', // Hainaut/Wallonie
    'geo.placename': 'Mons',
    'geo.position': '50.4542;3.9567',
    'ICBM': '50.4542, 3.9567'
  },
  openGraph: {
    title: 'STRYV Lab | La Science de la Transformation Physique',
    description: 'Ne devinez plus. Analysez. Coaching sportif basé sur vos données biologiques (IPT) à Mons.',
    url: 'https://www.stryvlab.com',
    siteName: 'STRYV Lab',
    locale: 'fr_BE',
    type: 'website',
    images: [
      {
        url: '/images/og-stryv.png',
        width: 1200,
        height: 630,
        alt: 'Stryv Lab - Ingénierie Métabolique',
      },
    ],
  },
};

// --- DONNÉES STRUCTURÉES (SCHEMA.ORG) ---
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HealthClub",
      "@id": "https://www.stryvlab.com/#organization",
      "name": "Stryv Lab - Ingénierie Métabolique",
      "alternateName": ["Stryv Lab", "Stryv Genesis"],
      "description": "Centre d'expertise en transformation physique et métabolique à Mons. Analyse IPT et coaching High-Ticket.",
      "url": "https://www.stryvlab.com",
      "logo": "https://www.stryvlab.com/logo-stryv.png",
      "priceRange": "€€€",
      "telephone": "+32472238612", 
      "email": "contact@stryvlab.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Boulevard Président Kennedy",
        "addressLocality": "Mons",
        "postalCode": "7000",
        "addressRegion": "Wallonie",
        "addressCountry": "BE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 50.4542,
        "longitude": 3.9567
      },
      "areaServed": ["Mons", "Bruxelles", "Hainaut", "Wallonie"],
      "sameAs": [
        "https://www.instagram.com/stryvlab",
        "https://www.linkedin.com/company/stryvlab"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services Stryv",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Analyse IPT (Diagnostic)"
            },
            "price": "35.00",
            "priceCurrency": "EUR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Coaching OMNI Elite"
            },
            "price": "650.00",
            "priceCurrency": "EUR"
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.stryvlab.com/#website",
      "url": "https://www.stryvlab.com",
      "name": "Stryv Lab",
      "inLanguage": "fr-BE"
    }
  ]
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
        
        {/* INJECTION DU SCHEMA.ORG */}
        <Script
          id="stryv-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}