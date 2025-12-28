// tailwind.config.ts
// GENESIS Medical-Grade Design System — Tailwind Configuration
// Palette de couleurs exacte fournie

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // GOLDEN RATIO TYPOGRAPHY SCALE (1.618)
      fontSize: {
        'xs': ['0.694rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.618rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.618rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['2.024rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.618rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3.236rem', { lineHeight: '3rem', letterSpacing: '-0.03em' }],
        '6xl': ['4.236rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '7xl': ['5.618rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '8xl': ['7.618rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      
      // PALETTE DE COULEURS EXACTE
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // FOND PRINCIPAL
        'bg-primary': '#EDF3F7',
        
        // TEXT PRINCIPAL
        'text-primary': '#0F2334',
        
        // TEXT SECOND
        'text-secondary': '#2D5168',
        
        // ACCENT 1 (STRYV Cyan)
        'accent-cyan': '#19D4FF',
        'accent-cyan-light': 'rgba(25,212,255,0.2)',
        
        // ACCENT WARNING
        'accent-warning': '#F3B544',
        
        // ACCENT SUCCESS
        'accent-success': '#37E6A5',
        
        // WHITE PURE
        'white-pure': '#FFFFFF',
        
        // GLASS WHITE
        'glass-white': 'rgba(255,255,255,0.10)',
        
        // GLASS BORDER
        'glass-border': 'rgba(255,255,255,0.25)',
        
        // OVERLAY DARK
        'overlay-dark': 'rgba(0,0,0,0.45)',
        
        // Legacy support (pour compatibilité)
        obsidian: {
          50: '#f5f6f7',
          100: '#e4e7ea',
          200: '#ccd2d8',
          300: '#a8b1bc',
          400: '#7d8a99',
          500: '#606d7e',
          600: '#4d5968',
          700: '#404956',
          800: '#373f4a',
          900: '#0F2334', // Text principal
          950: '#030507',
        },
        
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#37E6A5', // Accent success
          600: '#00cc82',
          700: '#009966',
          800: '#00664d',
          900: '#004d3a',
          950: '#002619',
        },
        
        // Glassmorphism layers (nouvelle palette)
        glass: {
          light: 'rgba(255, 255, 255, 0.10)',
          medium: 'rgba(255, 255, 255, 0.15)',
          strong: 'rgba(255, 255, 255, 0.20)',
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // 5-LEVEL DEPTH SYSTEM
      boxShadow: {
        'depth-1': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'depth-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'depth-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'depth-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'depth-5': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Cyan glows (STRYV)
        'glow-sm': '0 0 10px rgba(25, 212, 255, 0.3)',
        'glow-md': '0 0 20px rgba(25, 212, 255, 0.4), 0 0 40px rgba(25, 212, 255, 0.2)',
        'glow-lg': '0 0 30px rgba(25, 212, 255, 0.5), 0 0 60px rgba(25, 212, 255, 0.3), 0 0 90px rgba(25, 212, 255, 0.1)',
        
        // Glass shadows
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      
      // BACKDROP BLUR
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // SPACING SYSTEM (8rem base pour sections)
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // BORDER RADIUS SYSTEM
      borderRadius: {
        // New radius system
        'container': '32px',
        'card': '20px',
        'button': '9999px',
        
        // Legacy system (kept for compatibility)
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // GRADIENTS
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-medical': 'linear-gradient(135deg, #EDF3F7 0%, #D4E3EB 50%, #EDF3F7 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #19D4FF 0%, #0FA8CC 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)',
      },
      
      // ANIMATIONS SPRING PHYSICS
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(25, 212, 255, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(25, 212, 255, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      
      // FONT FAMILIES
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        logo: ['Eurostile ExtendedBold', 'system-ui', 'sans-serif'],
      },
      
      // FONT WEIGHTS
      fontWeight: {
        'hairline': '100',
        'extralight': '200', // Poppins ExtraLight
        'light': '300', // Poppins Light
        'normal': '400', // Inter Regular
        'medium': '500', // Inter Medium / Poppins Medium
        'semibold': '600', // Poppins SemiBold (for numeric scores)
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
