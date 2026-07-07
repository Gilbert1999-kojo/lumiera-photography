/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Primary accent ───────────────────────── */
        'brand-orange': {
          DEFAULT: '#FF6600',
          light:   '#FF8533',
          dark:    '#E65C00',
          pale:    '#FFF3E8',
        },
        /* ── Deep-black surface scale ─────────────── */
        'brand-dark': {
          DEFAULT:  '#0A0A0A',  // page background
          surface:  '#141414',  // card / sheet backgrounds
          elevated: '#1E1E1E',  // raised elements
          line:     '#2A2A2A',  // borders / dividers
          muted:    '#3D3D3D',  // hover / disabled fills
          subtle:   '#737373',  // muted label text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
