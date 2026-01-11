import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /* =====================================================
         SYSTÈME CHROMATIQUE (VERROUILLÉ)
         ===================================================== */
      colors: {
        background: '#ededed',
        surface: '#ededed',
        'surface-light': '#f5f5f5',
        accent: '#0e8c5b',
        primary: '#1A1A1A',
        secondary: '#6D6D6D',
        muted: '#0e8c5b',
      },

      /* =====================================================
         SYSTÈME DE RAYONS (BORDER-RADIUS)
         ===================================================== */
      borderRadius: {
        card: '24px',
        widget: '18px',
        btn: '12px',
      },

      /* =====================================================
         TYPOGRAPHIE
         ===================================================== */
      fontFamily: {
        sans: ['Lufga', 'sans-serif'],
      },

      /* =====================================================
         LUMIÈRE & OMBRES (NEUMORPHISM TECHNIQUE)
         ===================================================== */
         boxShadow: {
          'soft-out': '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff', // L'effet 3D sortant
          'soft-in': 'inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff', // L'effet 3D creusé
        }
    },
  },

  plugins: [],
};

export default config;