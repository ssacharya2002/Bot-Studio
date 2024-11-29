import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        Home_background: 'hsl(var(--home-background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        'home-background': 'hsl(var(--home-background))',
        'home-foreground': 'hsl(var(--home-foreground))',
        'home-card': {
          DEFAULT: 'hsl(var(--home-card))',
          foreground: 'hsl(var(--home-card-foreground))',
        },
        'home-popover': {
          DEFAULT: 'hsl(var(--home-popover))',
          foreground: 'hsl(var(--home-popover-foreground))',
        },
        'home-primary': {
          DEFAULT: 'hsl(var(--home-primary))',
          foreground: 'hsl(var(--home-primary-foreground))',
        },
        'home-secondary': {
          DEFAULT: 'hsl(var(--home-secondary))',
          foreground: 'hsl(var(--home-secondary-foreground))',
        },
        'home-muted': {
          DEFAULT: 'hsl(var(--home-muted))',
          foreground: 'hsl(var(--home-muted-foreground))',
        },
        'home-accent': {
          DEFAULT: 'hsl(var(--home-accent))',
          foreground: 'hsl(var(--home-accent-foreground))',
        },
        'home-destructive': {
          DEFAULT: 'hsl(var(--home-destructive))',
          foreground: 'hsl(var(--home-destructive-foreground))',
        },
        'home-border': 'hsl(var(--home-border))',
        'home-input': 'hsl(var(--home-input))',
        'home-ring': 'hsl(var(--home-ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        homeLg: 'var(--home-radius)',
        homeMd: 'calc(var(--home-radius) - 2px)',
        homeSm: 'calc(var(--home-radius) - 4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
