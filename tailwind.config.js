/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Repower Brand Colors (from Figma)
        'repower': {
          'red': '#E30613',
          'red-dark': '#C70511',
          'red-light': '#FF1A2B',
          'dark': '#1A1A1A',
          'dark-light': '#2D2D2D',
          'gray': {
            '50': '#FAFAFA',
            '100': '#F5F5F5', 
            '200': '#EEEEEE',
            '300': '#E0E0E0',
            '400': '#BDBDBD',
            '500': '#9E9E9E',
            '600': '#757575',
            '700': '#616161',
            '800': '#424242',
            '900': '#212121'
          },
          'blue': {
            '50': '#E3F2FD',
            '100': '#BBDEFB',
            '500': '#2196F3',
            '600': '#1976D2',
            '700': '#1565C0'
          },
          'green': {
            '50': '#E8F5E8',
            '100': '#C8E6C9',
            '500': '#4CAF50',
            '600': '#43A047',
            '700': '#388E3C'
          },
          'orange': {
            '50': '#FFF3E0',
            '100': '#FFE0B2',
            '500': '#FF9800',
            '600': '#FB8C00',
            '700': '#F57C00'
          }
        }
      },
      fontFamily: {
        'sans': ['theMixB', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['theMixB', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Repower Typography Scale (from Figma)
        'xs': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.025em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0.025em' }],     // 14px  
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],               // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.025em' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],         // 24px
        '3xl': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],          // 32px
        '4xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.05em' }],          // 40px
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.05em' }],          // 48px
        '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.05em' }],         // 60px
        // Display sizes
        'display-sm': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em' }], // 36px
        'display-md': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.025em' }],     // 48px
        'display-lg': ['4rem', { lineHeight: '4.5rem', letterSpacing: '-0.025em' }],     // 64px
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',      // theMixB Light
        'normal': '400',     // theMixB Regular  
        'medium': '500',     // theMixB Medium
        'semibold': '600',   // theMixB SemiBold
        'bold': '700',       // theMixB Bold
        'extrabold': '800',  // theMixB ExtraBold
        'black': '900'
      },
      letterSpacing: {
        'tightest': '-0.075em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      spacing: {
        // Repower 8px Grid System
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.5rem',     // 24px
        '2xl': '2rem',      // 32px
        '3xl': '3rem',      // 48px
        'full': '9999px',
      },
      boxShadow: {
        // Repower Shadow System
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};