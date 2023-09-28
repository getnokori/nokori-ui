/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    letterSpacing: {
      normal: '0.0125rem',
      wide: '0.025rem'
    },
    fontSize: {
      '3xs': ['0.6875rem', { lineHeight: '1rem' }],
      '2xs': ['0.8125rem', { lineHeight: '1.25rem' }],
      xs: ['0.875rem', { lineHeight: '1.5rem' }],
      sm: ['0.938rem', { lineHeight: '1.5rem' }], // 14px
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],

      15: ['0.938rem', { lineHeight: '22px' }], //15px
      24: ['24px', { lineHeight: '32px' }]
    },
    extend: {
      textOpacity: ['dark'],
      colors: {
        'lola-gray': '#26272b'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}
