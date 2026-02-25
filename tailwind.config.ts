import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E293B',
          accent: '#6366F1',
          accentSoft: '#818CF8',
          background: '#F8FAFC',
          text: '#0F172A',
          secondary: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -14px rgba(15, 23, 42, 0.28)',
      },
    },
  },
};

export default config;
