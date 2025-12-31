import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /* =========================
         TYPOGRAPHY — GENESIS LAB SYSTEM
         ========================= */
      fontFamily: {
        // 1. OUTFIT (Par défaut)
        // Remplace la police "sans" par défaut. Tout le site sera en Outfit.
        sans: [
          "var(--font-outfit)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        
        // 2. AZONIX (Pour le logo "STRYV")
        // Utilisation: className="font-azonix"
        azonix: ["var(--font-azonix)", "sans-serif"],

        // 3. RAMABHADRA (Pour H1, H2)
        // Utilisation: className="font-ramabhadra"
        ramabhadra: ["var(--font-ramabhadra)", "sans-serif"],

        // 4. MONO (Pour les données techniques)
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      /* =========================
         COLOR TOKENS — MEDUSMO (LOCKED)
         ========================= */
      colors: {
        /* Backgrounds */
        bg: "var(--bg-main)",
        bgSoft: "var(--bg-soft)",
        bgSecondary: "var(--bg-secondary)",

        /* Text */
        text: "var(--text-main)",
        textMuted: "var(--text-muted)",
        textSoft: "var(--text-soft)",
        textInvert: "var(--text-invert)",

        /* Structure */
        divider: "var(--divider)",

        /* Accent (unique) */
        accent: "var(--accent)",
      },

      /* =========================
         SHADOWS — NONE (INTENTIONAL)
         ========================= */
      boxShadow: {
        none: "none",
      },

      /* =========================
         MOTION — NEUTRAL
         ========================= */
      transitionTimingFunction: {
        linear: "linear",
      },
    },
  },

  plugins: [],
};

export default config;