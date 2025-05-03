/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{html,ts,scss}'],

  theme: {
    colors: {
      primary: 'var(--color-primary)',
      accent: 'var(--color-accent)',
      secondary: 'var(--color-secondary)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')
,require('@tailwindcss/forms')
,require('@tailwindcss/line-clamp')
,require('@tailwindcss/typography'),

],
};
