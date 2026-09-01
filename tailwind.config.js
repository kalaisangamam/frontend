/** @type {import('tailwindcss').Config} */

// Palette tokens are backed by CSS variables (see src/index.css) so every
// existing utility class (bg-ink-900, text-parchment-100, etc.) automatically
// re-themes when the `light` class is toggled on <html> — no need to touch
// individual components.
const themed = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: themed('ink-950'), // deepest page canvas
          900: themed('ink-900'),
          800: themed('ink-800'),
          700: themed('ink-700'),
        },
        brass: {
          200: themed('brass-200'),
          300: themed('brass-300'),
          400: themed('brass-400'),
          500: themed('brass-500'), // primary accent — warm gold
          600: themed('brass-600'),
        },
        maroon: {
          300: themed('maroon-300'),
          400: themed('maroon-400'),
          500: themed('maroon-500'), // secondary accent — rich temple red
          600: themed('maroon-600'),
        },
        parchment: {
          100: themed('parchment-100'), // primary text
          200: themed('parchment-200'),
          300: themed('parchment-300'), // secondary text
        },
        slate: {
          300: themed('slate-300'),
          400: themed('slate-400'),
          500: themed('slate-500'),
          600: themed('slate-600'),
        },
        // Fixed (non-theming) near-black used as text on top of brass/gold
        // accents (buttons, active pills, badges) — stays readable in both themes.
        onaccent: '#15100b',
        // Deep maroon is intentionally retained for destructive actions in
        // both themes, so it needs a stable light foreground instead of the
        // regular (theme-changing) body text token.
        'on-danger': '#fffaf5',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'stick-sweep': 'linear-gradient(105deg, transparent 48%, #C89B3C 48.5%, #C89B3C 50%, transparent 50.5%)',
      },
    },
  },
  plugins: [],
};
