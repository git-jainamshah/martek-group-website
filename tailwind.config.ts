import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        display: ['var(--font-instrument)', 'Instrument Serif', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        paper: { DEFAULT: '#FBF6EC', '2': '#F4EDDD', '3': '#EBE3D0' },
        ink: { DEFAULT: '#1A1A1E', '2': '#2B2B30', mut: '#6E6A62', soft: '#A39E94' },
        terra: { DEFAULT: '#E07A5F', soft: '#F2BFA8' },
        sage: { DEFAULT: '#6B9080', soft: '#B7CDC0' },
        butter: { DEFAULT: '#F2CC8F', soft: '#F9E5BD' },
        peri: { DEFAULT: '#8390C8', soft: '#BFC6E2' },
        plum: { DEFAULT: '#8B5A8C', soft: '#C9A9CB' },
        brand: { DEFAULT: '#ED1C24', ink: '#C8141B', soft: '#FBD9DA' },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        'martek-red': '#E4251F', // Keeping legacy
        'martek-black': '#000000',
        'martek-gray': '#111111',
        'martek-beige': '#F9F9F5',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
