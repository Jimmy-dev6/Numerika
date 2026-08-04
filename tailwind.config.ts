import type { Config } from 'tailwindcss'

/**
 * Tokens de la DA Numerika (brief §4.3, §4.4).
 * Deux régimes visuels : Production (papier) et Media (nuit).
 * La bascule se fait via [data-mode='media'] qui redéfinit les
 * variables sémantiques (--bg, --fg, …) dans globals.css.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      /* Mode Production */
      paper: '#FBFAF7',
      ink: '#111111',
      'ink-soft': '#5A5A56',
      rule: '#DEDBD4',
      // À CONFIRMER : à remplacer par la valeur exacte de la charte
      // dès réception du logo vectoriel. Token unique, propagé partout.
      red: '#E0261F',

      /* Mode Media */
      night: '#0B0F14',
      'night-soft': '#161C24',
      signal: '#FFC400',
      'night-rule': '#2A323C',
      /* Équivalent nuit de --ink-soft, validé étape 1 (amendement au brief) */
      'night-fg-soft': '#98A1AD',

      /* États d'inventaire */
      libre: '#3DBE6B',
      occupe: '#7A8290',

      /* Sémantiques — suivent la bascule jour/nuit via CSS vars */
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      fg: 'var(--fg)',
      'fg-soft': 'var(--fg-soft)',
      line: 'var(--line)',
      accent: 'var(--accent)',
    },
    fontFamily: {
      display: ['var(--font-archivo)', 'sans-serif'],
      sans: ['var(--font-instrument)', 'sans-serif'],
      mono: ['var(--font-plex-mono)', 'monospace'],
    },
    fontSize: {
      /* Échelle du brief §4.4, mobile d'abord */
      'display-xl': ['clamp(2.75rem, 11vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      'display-l': ['clamp(2rem, 6vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      'display-m': ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      body: ['1.0625rem', { lineHeight: '1.65' }],
      data: ['0.8125rem', { letterSpacing: '0.04em' }],
      /* Tailles utilitaires (nav, légendes) */
      sm: ['0.9375rem', { lineHeight: '1.5' }],
      xs: ['0.8125rem', { lineHeight: '1.5' }],
    },
    borderRadius: {
      /* Rayon 0 partout, sauf les boutons à 2px (brief §4.5) */
      none: '0',
      btn: '2px',
    },
    extend: {
      maxWidth: {
        grid: '90rem',
      },
      gap: {
        gutter: '24px',
      },
    },
  },
  plugins: [],
}

export default config
