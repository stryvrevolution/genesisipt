/** @type {import('next').NextConfig} */

// ASTUCE : Changez cette variable en 'true' pour construire le mobile, 
// et en 'false' quand vous envoyez sur Vercel !
const isMobileBuild = false; // <--- METTRE SUR 'FALSE' AVANT DE POUSSER SUR VERCEL

const nextConfig = {
  // Active l'export statique UNIQUEMENT si on construit pour le mobile
  output: isMobileBuild ? 'export' : undefined,

  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        // 1. RÈGLES CORS (Pour autoriser l'App Mobile à contacter l'API)
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Autorise tout le monde (iPhone inclus)
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
      {
        // 2. RÈGLES DE SÉCURITÉ (Votre configuration existante Calendly, etc.)
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "connect-src 'self' https://calendly.com https://*.calendly.com https://genesis-system.vercel.app", // J'ai ajouté votre API ici par sécurité
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