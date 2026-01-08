/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- CONFIGURATION CAPACITOR (OBLIGATOIRE) ---
  output: 'export', // Crée un dossier statique "out" au lieu d'un serveur Node
  images: {
    unoptimized: true, // Désactive l'optimisation serveur des images
  },
  // ---------------------------------------------

  typescript: {
    // Ignore les erreurs TypeScript pour le déploiement
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les erreurs de style
    ignoreDuringBuilds: true,
  },

  // Note : Ces headers fonctionneront sur le site web (Vercel), 
  // mais seront ignorés par l'application mobile (car c'est du statique).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "connect-src 'self' https://calendly.com https://*.calendly.com",
              "frame-src https://calendly.com https://*.calendly.com",
              "img-src 'self' data: https://assets.calendly.com",
              "font-src 'self' https://assets.calendly.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;