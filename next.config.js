/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore les erreurs TypeScript pour le déploiement
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les erreurs de style
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;