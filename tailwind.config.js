/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // High contrast color palette
        'repower': {
          'red': '#E30613',
          'dark': '#1a1a1a',
          'gray': {
            '50': '#fafafa',
            '100': '#f5f5f5', 
            '200': '#e5e5e5',
            '300': '#d4d4d4',
            '400': '#a3a3a3',
            '500': '#737373',
            '600': '#525252',
            '700': '#404040',
            '800': '#262626',
            '900': '#171717'
          }
        }
      },
      fontFamily: {
        'sans': ['theMixB', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Repower-inspired font scale
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],  // 14px  
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],           // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.05em' }],         // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],      // 60px
      },
      fontWeight: {
        'light': '300',    // theMixB Light
        'normal': '400',   // theMixB Regular  
        'medium': '500',   // theMixB Medium
        'bold': '700',     // theMixB Bold
        'extrabold': '800' // theMixB ExtraBold
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.01em',
        'wider': '0.02em',
      }
    },
  },
  plugins: [],
};
