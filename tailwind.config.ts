/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stryv: {
          bg0: "var(--bg-0)",
          bg1: "var(--bg-1)",
          bg2: "var(--bg-2)",

          surface0: "var(--surface-0)",
          surface1: "var(--surface-1)",
          surface2: "var(--surface-2)",
          surface3: "var(--surface-3)",

          stroke0: "var(--stroke-0)",
          stroke1: "var(--stroke-1)",
          stroke2: "var(--stroke-2)",

          text: {
            primary: "var(--text-primary)",
            secondary: "var(--text-secondary)",
            muted: "var(--text-muted)",
            disabled: "var(--text-disabled)"
          },

          accent: "var(--accent)",
          accentSoft: "var(--accent-soft)",
          accentStroke: "var(--accent-stroke)",

          good: "var(--good)",
          warn: "var(--warn)",
          bad: "var(--bad)"
        }
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)"
      },
      boxShadow: {
        soft: "var(--sh-soft)",
        lift: "var(--sh-lift)"
      },
      backdropBlur: {
        glass: "var(--blur-glass)",
        hud: "var(--blur-hud)"
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        out: "var(--ease-out)"
      },
      transitionDuration: {
        fast: "var(--t-fast)",
        base: "var(--t-base)",
        slow: "var(--t-slow)"
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)"
      },
      letterSpacing: {
        tight: "-0.02em",
        normal: "0em",
        wide: "0.06em",
        wider: "0.12em"
      },
      maxWidth: {
        container: "1200px"
      }
    }
  },
  plugins: []
};
