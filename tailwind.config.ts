import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Core tokens (shadcn-style) */
        background: '#252525',                // bg-background
        foreground: '#F1F5F9',                // text-foreground
        card: '#2B2B2B',                      // bg-card
        'card-foreground': '#F1F5F9',         // text-card-foreground
        popover: '#2B2B2B',
        'popover-foreground': '#F1F5F9',
        primary: {                            // bg-primary / text-primary-foreground
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          foreground: '#E2E8F0',
        },
        muted: '#1A1A1A',                     // bg-muted
        'muted-foreground': '#94A3B8',        // text-muted-foreground
        accent: {
          DEFAULT: '#1F2937',
          foreground: '#F1F5F9',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        border: 'rgba(255,255,255,0.10)',     // border-border
        input: 'rgba(255,255,255,0.10)',
        ring: '#6366F1',                      // ring-*
        /* Your existing palettes can stay here too (dark, neutral, iris, blush, etc.) */
        dark: { base:'#252525', surface:'#2B2B2B', elevated:'#333333', muted:'#1A1A1A' },
        iris: { 400:'#818CF8', 500:'#6366F1' }, 
        blush:{ 400:'#F472B6', 500:'#EC4899' }, 
        lime:{ 400:'#A3E635' }, 
        cyan:{ 400:'#22D3EE' },
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgb(0 0 0 / 0.1)',
        'elev-2': '0 4px 16px rgb(0 0 0 / 0.15)',
        'elev-3': '0 8px 32px rgb(0 0 0 / 0.3)',
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
}

export default config