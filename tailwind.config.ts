import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: { base:'#252525', surface:'#2B2B2B', elevated:'#333333', muted:'#1A1A1A' },
        iris: { 500:'#6366F1' }, blush:{ 500:'#EC4899' }, lime:{ 400:'#A3E635' }, cyan:{ 400:'#22D3EE' },
        border: 'rgba(255,255,255,0.10)',
      },
      borderRadius: { '2xl':'24px' },
      boxShadow: {
        'elev-2': '0 4px 16px rgb(0 0 0 / 0.15)',
        'elev-3': '0 8px 32px rgb(0 0 0 / 0.30)',
        'glow-iris': '0 0 20px rgb(99 102 241 / 0.4)',
      },
      fontFamily: {
        sans: [
          '-apple-system','BlinkMacSystemFont',"SF Pro Text","SF Pro Display",
          "Segoe UI","Roboto","Inter","Helvetica Neue","Arial","sans-serif"
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
