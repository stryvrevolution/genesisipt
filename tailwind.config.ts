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
         TYPOGRAPHY — GENESIS SYSTEM
         ========================= */
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],

        azonix: ["var(--font-azonix)", "sans-serif"],
        ramabhadra: ["var(--font-ramabhadra)", "sans-serif"],
        michroma: ["Michroma", "sans-serif"],

        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },

      /* =========================
         COLOR TOKENS — DASHBOARD
         ========================= */
      colors: {

        /* système existant (inchangé) */
        bg: "var(--bg-main)",
        bgSoft: "var(--bg-soft)",
        bgSecondary: "var(--bg-secondary)",

        text: "var(--text-main)",
        textMuted: "var(--text-muted)",
        textSoft: "var(--text-soft)",
        textInvert: "var(--text-invert)",

        divider: "var(--divider)",
        accent: "var(--accent)",

        /* GENESIS — MODE APP */
        genesis: {
          bg: "#ECECEC",        // fond global app
          panel: "#F4F4F4",     // cartes principales
          surface: "#FFFFFFB3", // widgets / sous-cartes
          border: "#FFFFFFCC",  // bordures subtiles

          text: "#111111",      // titres
          sub: "#374151",       // corps
          muted: "#6B7280",     // labels

          action: "#111111",    // boutons principaux
          accent: "#16A34A",    // état actif / validation
        },
      },

      /* =========================
         BORDER RADIUS — UNIFIÉ
         ========================= */
      borderRadius: {
        panel: "28px",
        widget: "20px",
        button: "16px",
      },

      /* =========================
         SHADOWS — PHYSICAL UI
         ========================= */
      boxShadow: {
        none: "none",

        /* dashboard */
        panel: "0 16px 40px rgba(0,0,0,0.08)",
        widget: "0 8px 24px rgba(0,0,0,0.06)",
        hover: "0 20px 50px rgba(0,0,0,0.10)",

        /* legacy (à déprécier progressivement) */
        "glass-card":
          "0 40px 80px -20px rgba(50, 50, 93, 0.15), 0 20px 40px -20px rgba(0, 0, 0, 0.1)",
        "glass-widget":
          "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
        "glass-btn":
          "0 10px 20px -5px rgba(0, 0, 0, 0.3)",
        "glass-btn-hover":
          "0 15px 30px -5px rgba(0, 0, 0, 0.4)",
      },

      /* =========================
         BACKGROUNDS (DÉPRÉCIÉS)
         ========================= */
      backgroundImage: {
        /* à garder uniquement si besoin legacy */
        "genesis-mesh": `
          radial-gradient(at 0% 0%, rgba(226,232,240,0.6) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(241,245,249,0.6) 0px, transparent 50%)
        `,
        noise:
          `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      },

      /* =========================
         MOTION — SOBER & UTILE
         ========================= */
      transitionTimingFunction: {
        genesis: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.25s ease-out forwards",
        "fade-up": "fade-up 0.3s ease-out forwards",
      },
    },
  },

  plugins: [],
};

export default config;
