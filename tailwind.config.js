/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:      '#FBF8F3',
        sage:       '#88A096',
        'sage-soft':'#A8C09A',
        'sage-mist':'#E2EBE3',
        terracotta: '#D4886A',
        amber:      '#E8B86E',
        'amber-soft':'#F5DDA9',
        charcoal:   '#2D3142',
        'warm-grey':'#7C7C72',
        'warm-line':'#E8E2D7'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        soft:  '0 4px 24px -8px rgba(45, 49, 66, 0.10)',
        glow:  '0 0 0 4px rgba(168, 192, 154, 0.35)',
        amber: '0 0 0 4px rgba(232, 184, 110, 0.30)'
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        pulse:   'pulse-soft 2s ease-in-out infinite'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%':      { transform: 'scale(1.06)', opacity: '1' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
